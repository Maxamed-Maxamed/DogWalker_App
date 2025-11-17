import { Booking, Walk, WalkPhoto } from '@/types/walker';
import { supabase } from '@/utils/supabase';

// Create a booking (owner creates, walker may be assigned later)
export async function createBooking(payload: Partial<Booking>) {
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
  // Also mark booking in_progress
  await supabase.from('bookings').update({ status: 'in_progress' }).eq('id', bookingId);

  return data as Walk;
}

// End a walk
export async function endWalk(walkId: string, updates?: Partial<Walk>) {
  const payload = { ended_at: new Date().toISOString(), ...updates };
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

  // Build file path
  const timestamp = Date.now();
  const ext = fileUri.split('.').pop() || 'jpg';
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
  const { data, error } = await supabase
    .from('walks')
    .select('*')
    .eq('walker_id', walkerId)
    .is('ended_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  if (error && (error as any).code !== 'PGRST116') throw error; // PGRST116 = no rows? keep as passthrough
  return data as Walk | null;
}

export default {
  createBooking,
  getBookingsForWalker,
  startWalk,
  endWalk,
  uploadWalkPhoto,
  getActiveWalkForWalker,
};
