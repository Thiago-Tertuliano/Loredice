import { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { ThemeProvider } from '../src/lib/theme';
import { StatusBar } from 'expo-status-bar';
import { initializeDatabase } from '../src/lib/initialize-database';
import { useLoreDiceFonts } from '../src/lib/fonts';
import { View } from 'react-native';

// SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const { fontsLoaded, fontError } = useLoreDiceFonts();

  useEffect(() => {1
    initializeDatabase().catch(err => console.error("Database init error:", err));
  }, []);

  useEffect(() => {
    console.log("Fonts status:", { fontsLoaded, fontError });
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(err => console.error("Splash hide error:", err));
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return <View style={{ flex: 1, backgroundColor: '#0F0D1A' }} />;
  }

  return (
    <ThemeProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="game/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="match/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
