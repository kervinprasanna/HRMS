import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import { COLORS } from '../constants/theme';

import LoginScreen from '../screens/auth/LoginScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  const CustomTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: isDarkMode ? COLORS.dark.background : COLORS.light.background,
      card: isDarkMode ? COLORS.dark.surface : COLORS.light.surface,
      text: isDarkMode ? COLORS.dark.text : COLORS.light.text,
      border: isDarkMode ? COLORS.dark.border : COLORS.light.border,
      primary: isDarkMode ? COLORS.dark.primary : COLORS.light.primary,
    },
  };

  return (
    <NavigationContainer theme={CustomTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Logged in user sees the main tabs
          <Stack.Screen name="MainTabs" component={TabNavigator} />
        ) : (
          // Not logged in user sees the login screen
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
