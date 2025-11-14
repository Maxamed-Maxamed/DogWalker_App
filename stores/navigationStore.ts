import { create } from 'zustand';

export const TAB_ROUTES = ['dashboard', 'pets', 'explore'] as const;
export type TabRoute = (typeof TAB_ROUTES)[number];

export const isTabRoute = (route?: string | null): route is TabRoute =>
  Boolean(route && TAB_ROUTES.includes(route as TabRoute));

type NavigationState = {
  /** Currently focused tab route */
  currentTab: TabRoute;
  /** Setter for the currently focused tab */
  setCurrentTab: (tab: TabRoute) => void;
  /** Initial tab route for tab navigator */
  initialRoute: TabRoute;
  /** Setter for initial route, useful for deferred configuration */
  setInitialRoute: (route: TabRoute) => void;
};

export const useNavigationStore = create<NavigationState>((set) => ({
  currentTab: 'dashboard',
  setCurrentTab: (tab) => set({ currentTab: tab }),
  initialRoute: 'dashboard',
  setInitialRoute: (route) => set({ initialRoute: route }),
}));

export default useNavigationStore;
