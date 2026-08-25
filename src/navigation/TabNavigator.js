import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import RequestsScreen from '../screens/main/RequestsScreen';
import AttendanceScreen from '../screens/main/AttendanceScreen';
import useThemeStore from '../store/useThemeStore';
import { COLORS } from '../constants/theme';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PlaceholderScreen = ({ name }) => {
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
      <Text style={{ fontSize: 24, color: theme.text }}>{name}</Text>
    </View>
  );
};

const NotificationsScreen = () => <PlaceholderScreen name="Notifications" />;

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: theme.surface,
        },
        headerTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          paddingBottom: 5 + insets.bottom,
          paddingTop: 5,
          height: 60 + insets.bottom,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Requests') iconName = focused ? 'document-text' : 'document-text-outline';
          else if (route.name === 'Attendance') iconName = focused ? 'time' : 'time-outline';
          else if (route.name === 'Notifications') iconName = focused ? 'notifications' : 'notifications-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Requests" component={RequestsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
