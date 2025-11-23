import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../redux/store'; // Ensure path is correct

export default function Layout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* The Login Screen (app/index.tsx) */}
        <Stack.Screen name="index" />
        
        {/* The Register Screen (app/register.tsx) */}
        <Stack.Screen name="register" />

        {/* The Main App Tabs (app/(tabs)/_layout.tsx) */}
        <Stack.Screen name="(tabs)" />

        {/* The Details Screen (app/details.tsx) */}
        <Stack.Screen name="details" options={{ presentation: 'modal' }} />
      </Stack>
    </Provider>
  );
}
