import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/use-auth';
import { AuthProvider } from "@/contexts/auth-context";

export const unstable_settings = {
    anchor: '(tabs)',
};

export default function RootLayout() {
    const { user, loading } = useAuth();
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AuthProvider>            
                <Stack screenOptions={{ headerShown: false }}>
                </Stack.Protected>
                <Stack.Protected guard={!user?.token}>
                    <Stack.Screen name="login" />
                </Stack.Protected>
            </Stack>
                <StatusBar style="auto" />
            </AuthProvider>

        </ThemeProvider>
    );
}
