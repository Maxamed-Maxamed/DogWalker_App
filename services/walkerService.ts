import { Booking, Walk, WalkPhoto } from '@/types/walker';
import { supabase } from '@/utils/supabase';

// Sync ALLOWED_BOOKING_STATUSES with type
const ALLOWED_BOOKING_STATUSES = ['requested', 'accepted', 'cancelled', 'completed', 'in_progress'] as const;

function validateWalkerId(walkerId: string) {
  if (!walkerId || typeof walkerId !== 'string' || !walkerId.trim()) {
    throw new Error('Invalid walkerId');
  }
}

// Create a booking (owner creates, walker may be assigned later)
export async function createBooking(payload: Partial<Booking>) {
  // Basic validation for required booking fields
  const missing: string[] = [];
  if (!payload.owner_id) missing.push('owner_id');
  if (!payload.pet_id) missing.push('pet_id');
  if (!payload.scheduled_at) missing.push('scheduled_at');
  const duration = Number(payload.duration_minutes);
  if (!Number.isFinite(duration) || duration <= 0) {
    missing.push('duration_minutes');
  }
  if (!payload.status) missing.push('status');

  if (missing.length) {
    throw new Error(`ValidationError: missing required booking fields: ${missing.join(', ')}`);
  }

  // Validate scheduled_at is a valid ISO timestamp
  if (isNaN(Date.parse(String(payload.scheduled_at)))) {
    throw new Error('ValidationError: scheduled_at must be a valid ISO timestamp');
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data as Booking;
}

// Get bookings for a walker
export async function getBookingsForWalker(walkerId: string, status?: string) {
  validateWalkerId(walkerId);

  if (status && !ALLOWED_BOOKING_STATUSES.includes(status as any)) {
    throw new Error(`Invalid status: ${status}`);
  }

  let query = supabase
    .from('bookings')
    .select('*')
    .eq('walker_id', walkerId)
    .order('scheduled_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;
  return data as Booking[];
}

// Start a walk (create or update walk record)
export async function startWalk(bookingId: string, walkerId: string) {
  // Create walk row
  const { data, error } = await supabase
    .from('walks')
    .insert([
      { booking_id: bookingId, walker_id: walkerId, started_at: new Date().toISOString() },
    ])
    .select()
    .single();

  if (error) throw error;

  // Attempt to update booking; if that fails, roll back the inserted walk to avoid inconsistent state
  try {
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ status: 'in_progress' })
      .eq('id', bookingId);

    if (bookingError) {
      // Try to remove the created walk to keep consistency
      try {
        if (data?.id) {
          await supabase.from('walks').delete().eq('id', data.id);
        }
      } catch (delErr) {
        console.error('Failed to rollback created walk after booking update failure', delErr);
      }

      throw bookingError;
    }
  } catch (e) {
    throw e;
  }

  return data as Walk;
}

// End a walk
export async function endWalk(walkId: string, updates?: Partial<Walk>) {
  const endedAt = new Date().toISOString();
  const safeUpdates = { ...(updates || {}) } as Partial<Walk>;
  // Prevent caller from overriding our generated ended_at
  delete (safeUpdates as any).ended_at;
  const payload = { ...safeUpdates, ended_at: endedAt };
  const { data, error } = await supabase
    .from('walks')
    .update(payload)
    .eq('id', walkId)
    .select()
    .single();

  if (error) throw error;

  // If the walk has booking_id, mark booking completed
  try {
    if (data?.booking_id) {
      await supabase.from('bookings').update({ status: 'completed' }).eq('id', data.booking_id);
    }
  } catch (e) {
    // Non-blocking: log but don't throw
    console.error('Failed to update booking status after ending walk', e);
  }

  return data as Walk;
}

// Upload a photo for a walk
export async function uploadWalkPhoto(walkerId: string, walkId: string, fileUri: string) {
  // Fetch file and convert to ArrayBuffer
  const response = await fetch(fileUri);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);

  // Build file path with robust extension extraction
  const timestamp = Date.now();
  let path = '';
  try {
    const parsed = new URL(fileUri);
    path = parsed.pathname || '';
  } catch {
    // Not a valid URL (could be blob:, data: or local path). Strip query/fragment.
    path = fileUri.split('?')[0].split('#')[0];
  }

  const lastSegment = path.substring(path.lastIndexOf('/') + 1) || '';
  let ext = '';
  if (lastSegment && lastSegment.includes('.')) {
    ext = lastSegment.substring(lastSegment.lastIndexOf('.') + 1).toLowerCase();
  } else if (blob && blob.type) {
    const mime = blob.type.toLowerCase();
    const mimeMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };
    ext = mimeMap[mime] || '';
  }

  if (!ext) ext = 'jpg';

  const filePath = `${walkerId}/${walkId}_${timestamp}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('walk-photos')
    .upload(filePath, uint8, { contentType: blob.type });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('walk-photos').getPublicUrl(filePath);

  // Insert record into walk_photos table (if exists)
  try {
    const { data: photoRow, error: insertError } = await supabase
      .from('walk_photos')
      .insert([
        { walk_id: walkId, walker_id: walkerId, file_path: filePath, public_url: urlData.publicUrl },
      ])
      .select()
      .single();

    if (insertError) {
      console.warn('Failed to insert walk_photos row:', insertError.message);
      // return minimal info
      return { file_path: filePath, public_url: urlData.publicUrl } as Partial<WalkPhoto>;
    }

    return photoRow as WalkPhoto;
  } catch (error) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.warn('Error inserting walk_photos row:', error);
    }
    return { file_path: filePath, public_url: urlData.publicUrl } as Partial<WalkPhoto>;
  }
}

// Utility: get active walk for a walker
export async function getActiveWalkForWalker(walkerId: string) {
  validateWalkerId(walkerId);
  const { data, error } = await supabase
    .from('walks')
    .select('*')
    .eq('walker_id', walkerId)
    .is('ended_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as Walk | null;
}

// Add booking status validation
export function validateBookingStatus(status: any) {
  if (status && !ALLOWED_BOOKING_STATUSES.includes(status)) {
    throw new Error(`Invalid booking status: ${status}`);
  }
}

// Make booking status update blocking/retry
async function updateBookingStatus(bookingId: string, status: string) {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) {
    // Retry once more on failure
    await new Promise((resolve) => setTimeout(resolve, 100));
    const { error: retryError } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);

    if (retryError) {
      throw retryError;
    }
  }
}

export default {
  createBooking,
  getBookingsForWalker,
  startWalk,
  endWalk,
  uploadWalkPhoto,
  getActiveWalkForWalker,
  validateBookingStatus,
  updateBookingStatus,
};
