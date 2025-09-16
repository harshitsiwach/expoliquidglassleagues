import '@walletconnect/react-native-compat';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { View, StyleSheet } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemeProvider as CustomThemeProvider } from '@/contexts/ThemeContext';

import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, arbitrum } from '@wagmi/core/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit, defaultWagmiConfig, AppKit } from '@reown/appkit-wagmi-react-native';

// 1. Get a project ID from https://dashboard.reown.com
const projectId = 'YOUR_PROJECT_ID';

// 2. Create a metadata object
const metadata = {
  name: 'Glass',
  description: 'Glass App',
  url: 'https://glass.xyz',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
  redirect: {
    native: 'glass://',
    universal: 'glass.xyz',
  },
};

// 3. Create a wagmi config
const chains = [mainnet, polygon, arbitrum] as const;
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// 4. Create an AppKit client
createAppKit({
  projectId,
  wagmiConfig,
  metadata,
  // Optional
  defaultChain: mainnet,
  enableAnalytics: true,
});

const queryClient = new QueryClient();


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <CustomThemeProvider>
          <View style={styles.container}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              </Stack>
              <StatusBar style="auto" />
              <AppKit />
            </ThemeProvider>
          </View>
        </CustomThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});