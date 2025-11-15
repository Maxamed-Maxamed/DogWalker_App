import { Redirect } from 'expo-router';

import { useAppStateStore } from '@/stores/appStateStore';

/**
 * Root entry point that forwards to the selected persona experience.
 * Defaults to the owner journey until another persona is chosen.
 */
export default function Index() {
  const activePersona = useAppStateStore((state) => state.activePersona);
  const target = activePersona === 'walker' ? '/DogWalker' : '/DogOfOwner';

  return <Redirect href={target} />;
}
