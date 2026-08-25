import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useAuthStore from '../../store/useAuthStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function LMSEEScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const isHR = user?.role === 'HR';
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      padding: SIZES.padding,
      paddingTop: Math.max(insets.top, SIZES.padding),
      backgroundColor: theme.headerBackground,
      
      
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.headerText,
      marginLeft: 16,
    },
    content: {
      flex: 1,
      padding: SIZES.padding,
      justifyContent: 'center',
      gap: SIZES.padding,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: SIZES.radius * 2,
      padding: SIZES.padding * 2,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    cardIconWrapper: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    cardDesc: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.headerText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LMS & Engagement</Text>
      </View>

      <View style={styles.content}>
        
        <TouchableOpacity 
          style={[styles.card, { borderColor: theme.primary + '50' }]} 
          onPress={() => navigation.navigate(isHR ? 'HRLMSTracker' : 'LMSDashboard')}
        >
          <View style={[styles.cardIconWrapper, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="library-outline" size={40} color={theme.primary} />
          </View>
          <Text style={styles.cardTitle}>{isHR ? 'Learning Tracker' : 'Learning Center'}</Text>
          <Text style={styles.cardDesc}>
            {isHR 
              ? 'Track employee course enrollments and learning progress.' 
              : 'Access training courses, track your learning progress, and earn certificates.'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, { borderColor: '#E91E6350' }]} 
          onPress={() => navigation.navigate('Engagement')}
        >
          <View style={[styles.cardIconWrapper, { backgroundColor: '#E91E6320' }]}>
            <Ionicons name="people-circle-outline" size={40} color="#E91E63" />
          </View>
          <Text style={styles.cardTitle}>Engagement Hub</Text>
          <Text style={styles.cardDesc}>Stay updated with company announcements, upcoming events, and polls.</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
