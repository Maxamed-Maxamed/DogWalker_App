import { Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { isTabRoute, TabRoute, useNavigationStore } from '@/stores/navigationStore';

export const unstable_settings = {
  initialRouteName: 'dashboard',
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const initialRoute = useNavigationStore((state) => state.initialRoute);
  const setInitialRoute = useNavigationStore((state) => state.setInitialRoute);
  const setCurrentTab = useNavigationStore((state) => state.setCurrentTab);

  useEffect(() => {
    // Ensure store knows which tab is the canonical entry point
    if (initialRoute !== 'dashboard') {
      setInitialRoute('dashboard');
    }
  }, [initialRoute, setInitialRoute]);

  const handleTabStateChange = useCallback(
    (event: { data: { state?: { index: number; routes: { name: string }[] } } }) => {
      const nextRouteName = event?.data?.state?.routes?.[event?.data?.state?.index]?.name;
      if (isTabRoute(nextRouteName)) {
        setCurrentTab(nextRouteName);
      }
    },
    [setCurrentTab]
  );

  const createTabListeners = useCallback(
    (route: TabRoute) => () => ({
      tabPress: () => setCurrentTab(route),
    }),
    [setCurrentTab]
  );

  return (
    <Tabs
      initialRouteName={initialRoute}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
      screenListeners={{ state: handleTabStateChange }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
        listeners={createTabListeners('dashboard')}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: 'My Pets',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="pawprint.fill" color={color} />,
        }}
        listeners={createTabListeners('pets')}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
        listeners={createTabListeners('explore')}
      />
     
    </Tabs>
  );
}
