import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/main/HomeScreen';
import useThemeStore from '../store/useThemeStore';
import { COLORS } from '../constants/theme';
import { View, Text } from 'react-native';

// Placeholder screens for other tabs
const PlaceholderScreen = ({ name }) => {
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
      <Text style={{ fontSize: 24, color: theme.text }}>{name}</Text>
    </View>
  );
};

const RequestsScreen = () => <PlaceholderScreen name="Requests" />;
const AttendanceScreen = () => <PlaceholderScreen name="Attendance" />;
const NotificationsScreen = () => <PlaceholderScreen name="Notifications" />;
const ProfileScreen = () => <PlaceholderScreen name="Profile" />;

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.surface,
        },
        headerTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen name="Alerts" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
