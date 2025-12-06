import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks';
import { IconSymbol } from '@/ui';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          // tabBarIcon: ({ color }) => <Feather name = "home"  color={color} size={28} 
          tabBarIcon: ({ color }) => <IconSymbol name="house.fill" color={color} size={28}
          
          />,
        }}
      />
       <Tabs.Screen
        name="find-walker"
        options={{
          title: 'Find Walker',

          tabBarIcon: ({ color }) => <Feather name="map-pin" color={color} size={28} />,
        }}
      />



      <Tabs.Screen
        name="pets"
        options={{
          title: 'My Pets',
          // tabBarIcon: ({ color }) => <IconSymbol size={28} name="pawprint.fill" color={color} />,
          tabBarIcon: ({ color }) => < FontAwesome5 size={28} name='paw' color={color} />,
          tabBarIconStyle: {
            
            
          }
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      /> 

      
    </Tabs>
  );
}
