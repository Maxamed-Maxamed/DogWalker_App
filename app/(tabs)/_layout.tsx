import { Tabs } from 'expo-router';
import React, { useCallback } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TabRoute, useNavigationStore } from '@/stores/navigationStore';

export const unstable_settings = {
  initialRouteName: 'dashboard',
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const setCurrentTab = useNavigationStore((state) => state.setCurrentTab);

  const createTabListeners = useCallback(
    (route: TabRoute) => () => ({
      tabPress: () => setCurrentTab(route),
    }),
    [setCurrentTab]
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
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
