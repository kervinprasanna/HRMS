import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useAuthStore from '../../store/useAuthStore';
import useThemeStore from '../../store/useThemeStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function HomeScreen() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
      padding: SIZES.padding,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 18,
      color: theme.textSecondary,
      marginBottom: 30,
    },
    button: {
      backgroundColor: theme.primary,
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
      width: '80%',
      alignItems: 'center',
      marginBottom: 15,
    },
    buttonText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: SIZES.md,
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.name}!</Text>
      <Text style={styles.subtitle}>Role: {user?.role}</Text>
      
      <TouchableOpacity style={styles.button} onPress={toggleTheme}>
        <Text style={styles.buttonText}>Toggle {isDarkMode ? 'Light' : 'Dark'} Mode</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, {backgroundColor: theme.danger}]} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
