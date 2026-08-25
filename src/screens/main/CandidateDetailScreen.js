import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useRecruitmentStore from '../../store/useRecruitmentStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function CandidateDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { candidate } = route.params;
  const { updateCandidateStatus } = useRecruitmentStore();
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const insets = useSafeAreaInsets();

  const STATUSES = ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.headerBackground,
      padding: SIZES.padding,
      paddingTop: Math.max(insets.top, SIZES.padding),
      
      
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.headerText,
      marginLeft: 16,
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginTop: 12,
      marginLeft: 40,
    },
    role: {
      fontSize: SIZES.md,
      color: theme.textSecondary,
      marginTop: 4,
      marginLeft: 40,
    },
    content: {
      padding: SIZES.padding,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
      marginTop: SIZES.padding,
    },
    infoCard: {
      backgroundColor: theme.surface,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      borderWidth: 1,
      borderColor: theme.border,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    infoLabel: {
      color: theme.textSecondary,
      fontSize: SIZES.md,
    },
    infoValue: {
      color: theme.text,
      fontSize: SIZES.md,
      fontWeight: '500',
    },
    pipelineContainer: {
      backgroundColor: theme.surface,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      borderWidth: 1,
      borderColor: theme.border,
    },
    statusBtn: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: SIZES.radius,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statusBtnActive: {
      backgroundColor: theme.primary + '20',
      borderColor: theme.primary,
    },
    statusText: {
      fontSize: SIZES.md,
      color: theme.text,
      fontWeight: '500',
    }
  });

  const handleStatusUpdate = (status) => {
    updateCandidateStatus(candidate.id, status);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.headerText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Candidate Profile</Text>
        </View>
        <Text style={styles.name}>{candidate.name}</Text>
        <Text style={styles.role}>{candidate.role} • {candidate.experience}</Text>
      </View>

      <View style={styles.content}>
        
        <Text style={styles.sectionTitle}>Contact & Info</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{candidate.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{candidate.phone}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Applied On</Text>
            <Text style={styles.infoValue}>{candidate.dateApplied}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recruitment Pipeline Status</Text>
        <View style={styles.pipelineContainer}>
          {STATUSES.map((status) => {
            const isActive = candidate.status === status;
            return (
              <TouchableOpacity 
                key={status}
                style={[styles.statusBtn, isActive && styles.statusBtnActive]}
                onPress={() => handleStatusUpdate(status)}
              >
                <Text style={[styles.statusText, isActive && {color: theme.primary, fontWeight: 'bold'}]}>
                  {status}
                </Text>
                {isActive && <Text style={{color: theme.primary}}>✓</Text>}
              </TouchableOpacity>
            )
          })}
        </View>
        
        <View style={{height: 40}} />
      </View>
    </ScrollView>
  );
}
