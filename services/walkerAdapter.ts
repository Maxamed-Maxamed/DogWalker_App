import type { Walker as DomainWalker } from '@/types/walker';

// Map the canonical domain `Walker` to the UI-shaped object used by Explore.
// Keep this mapping resilient to different payload shapes returned by the service.
export function mapDomainWalkerToExploreWalker(w: DomainWalker | any) {
  return {
    id: String(w?.id ?? w?.walker_id ?? w?.user_id ?? ''),
    name: w?.display_name ?? w?.name ?? w?.full_name ?? 'Walker',
    avatar: w?.avatar_url ?? w?.photo_url ?? w?.profile_image_url ?? undefined,
    distanceKm: typeof w?.distance_km === 'number' ? w.distance_km : (w?.distanceKm ?? 0),
    rating: typeof w?.avg_rating === 'number' ? w.avg_rating : (w?.rating ?? 0),
    bio: w?.bio ?? w?.description ?? undefined,
    lat: typeof w?.latitude === 'number' ? w.latitude : (w?.lat ?? undefined),
    lng: typeof w?.longitude === 'number' ? w.longitude : (w?.lng ?? undefined),
    services: w?.services ?? w?.offered_services ?? undefined,
  };

}
