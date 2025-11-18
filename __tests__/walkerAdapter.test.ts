import { mapDomainWalkerToExploreWalker } from '@/services/walkerAdapter';

// Minimal unit tests without test runner — kept simple so CI can adopt later.
function assertEqual(a: any, b: any, msg?: string) {
  const sa = JSON.stringify(a);
  const sb = JSON.stringify(b);
  if (sa !== sb) throw new Error(msg || `Assertion failed: ${sa} !== ${sb}`);
}

// Basic mapping sanity check
(() => {
  const domain = {
    id: 'w1',
    display_name: 'Alice',
    avatar_url: 'https://example.com/a.jpg',
    distance_km: 2.5,
    avg_rating: 4.8,
    bio: 'Friendly walker',
    latitude: 12.34,
    longitude: 56.78,
    services: ['walk']
  };

  const mapped = mapDomainWalkerToExploreWalker(domain as any);

  assertEqual(mapped.id, 'w1', 'id should map');
  assertEqual(mapped.name, 'Alice', 'name should map');
  assertEqual(mapped.avatar, 'https://example.com/a.jpg', 'avatar should map');
  assertEqual(mapped.distanceKm, 2.5, 'distance should map');
  assertEqual(mapped.rating, 4.8, 'rating should map');
  assertEqual(mapped.lat, 12.34, 'lat should map');
  assertEqual(mapped.lng, 56.78, 'lng should map');
})();

console.log('walkerAdapter basic checks passed');
