import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useAttendanceStore from '../../store/useAttendanceStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function AttendanceDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { employee } = route.params;
  const { isDarkMode } = useThemeStore();
  const { attendanceRecords } = useAttendanceStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const insets = useSafeAreaInsets();

  // In a real app, we would fetch by employee ID. Here we mock it by re-using the global records
  const records = attendanceRecords;

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
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.headerText,
      marginTop: 12,
      marginLeft: 40,
    },
    subtitle: {
      fontSize: SIZES.md,
      color: theme.headerText,Secondary,
      marginTop: 4,
      marginLeft: 40,
    },
    statsContainer: {
      flexDirection: 'row',
      padding: SIZES.padding,
      justifyContent: 'space-between',
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.surface,
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.primary,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 4,
    },
    listSection: {
      padding: SIZES.padding,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: SIZES.padding,
    },
    recordCard: {
      backgroundColor: theme.surface,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      marginBottom: SIZES.padding,
      borderWidth: 1,
      borderColor: theme.border,
    },
    recordHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.background,
    },
    recordDate: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    timeCol: {
      alignItems: 'center',
    },
    timeLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    timeValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    }
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.headerText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Attendance Log</Text>
        </View>
        <Text style={styles.title}>{employee.name}</Text>
        <Text style={styles.subtitle}>{employee.id}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>21</Text>
          <Text style={styles.statLabel}>Days Present</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, {color: theme.danger}]}>2</Text>
          <Text style={styles.statLabel}>Days Absent</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, {color: theme.warning}]}>98%</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>
      </View>

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>March 2024</Text>
        
        {records.map((record) => (
          <View key={record.id} style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <Text style={styles.recordDate}>{record.date}</Text>
              <View style={[styles.badge, { backgroundColor: record.status === 'Present' ? theme.success + '20' : theme.danger + '20' }]}>
                <Text style={[styles.badgeText, { color: record.status === 'Present' ? theme.success : theme.danger }]}>
                  {record.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.timeRow}>
              <View style={styles.timeCol}>
                <Text style={styles.timeLabel}>Check In</Text>
                <Text style={styles.timeValue}>{record.checkIn || '--:--'}</Text>
              </View>
              <View style={styles.timeCol}>
                <Text style={styles.timeLabel}>Check Out</Text>
                <Text style={styles.timeValue}>{record.checkOut || '--:--'}</Text>
              </View>
              <View style={styles.timeCol}>
                <Text style={styles.timeLabel}>Hours</Text>
                <Text style={[styles.timeValue, {color: theme.primary}]}>{record.hours}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
