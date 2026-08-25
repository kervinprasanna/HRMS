import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import useAuthStore from '../../store/useAuthStore';
import useThemeStore from '../../store/useThemeStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    const response = await login(email, password);
    if (!response.success) {
      Alert.alert('Login Failed', response.error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      padding: SIZES.padding * 2,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: SIZES.md,
      color: theme.textSecondary,
      marginBottom: SIZES.padding * 2,
    },
    inputContainer: {
      marginBottom: SIZES.padding,
    },
    label: {
      fontSize: SIZES.sm,
      color: theme.text,
      marginBottom: 8,
      fontWeight: '600',
    },
    input: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      color: theme.text,
      fontSize: SIZES.md,
    },
    button: {
      backgroundColor: theme.primary,
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
      alignItems: 'center',
      marginTop: SIZES.padding,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: SIZES.md,
      fontWeight: 'bold',
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to HRMS</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email / Employee ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={theme.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: SIZES.padding }}>
            <Text style={{ color: theme.primary, fontWeight: '600' }}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
