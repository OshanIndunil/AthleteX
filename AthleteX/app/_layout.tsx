import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../redux/store'; 

export default function Layout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* The Login Screen */}
        <Stack.Screen name="index" />
        
        {/* The Register Screen */}
        <Stack.Screen name="register" />

        {/* The Main App Tabs*/}
        <Stack.Screen name="(tabs)" />

        {/* The Details Screen */}
        <Stack.Screen name="details" options={{ presentation: 'modal' }} />
      </Stack>
    </Provider>
  );
}
