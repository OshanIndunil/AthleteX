import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons'; 

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007bff' }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
          headerShown: false, 
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <Feather name="heart" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}