import { Suspense, useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { useFonts } from 'expo-font';
import { YoungSerif_400Regular } from '@expo-google-fonts/young-serif';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DB_NAME, migrate } from '../db/schema';
import { Loading } from '../components/UI';
import { colors } from '../theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    YoungSerif_400Regular,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Suspense fallback={<Loading />}>
        <SQLiteProvider databaseName={DB_NAME} onInit={migrate} useSuspense>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.oat },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen name="quick-add" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          </Stack>
        </SQLiteProvider>
      </Suspense>
    </SafeAreaProvider>
  );
}
