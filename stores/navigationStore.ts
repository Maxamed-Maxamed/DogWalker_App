import { create } from 'zustand';

type NavigationState = {
  currentTab: 'dashboard' | 'explore';
  setCurrentTab: (tab: NavigationState['currentTab']) => void;
  initialRoute?: string;
  setInitialRoute: (route: string) => void;
};

export const useNavigationStore = create<NavigationState>((set) => ({
  currentTab: 'dashboard',
  setCurrentTab: (tab) => set({ currentTab: tab }),
  initialRoute: undefined,
  setInitialRoute: (route) => set({ initialRoute: route }),
}));

export default useNavigationStore;
