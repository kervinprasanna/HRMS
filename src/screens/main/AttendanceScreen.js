import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import useThemeStore from '../../store/useThemeStore';
import useAuthStore from '../../store/useAuthStore';
import useAttendanceStore from '../../store/useAttendanceStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function AttendanceScreen() {
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const { attendanceRecords, todayStatus, checkIn, checkOut } = useAttendanceStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const myRecords = attendanceRecords.filter(r => r.employeeId === user?.id || r.employeeName === user?.name);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      padding: SIZES.padding * 2,
      paddingTop: SIZES.padding * 3,
      backgroundColor: theme.primary,
      borderBottomLeftRadius: SIZES.radius * 2,
      borderBottomRightRadius: SIZES.radius * 2,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFF',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: SIZES.md,
      color: 'rgba(255,255,255,0.8)',
    },
    dashboardCard: {
      backgroundColor: theme.surface,
      margin: SIZES.padding,
      padding: SIZES.padding * 2,
      borderRadius: SIZES.radius,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      marginTop: -30,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    timeDisplay: {
      fontSize: 36,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    statusText: {
      fontSize: SIZES.md,
      color: todayStatus.isActive ? theme.success : theme.textSecondary,
      fontWeight: 'bold',
      marginBottom: SIZES.padding * 2,
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
    },
    punchBtn: {
      flex: 1,
      padding: 16,
      borderRadius: SIZES.radius,
      alignItems: 'center',
      marginHorizontal: 8,
    },
    punchBtnText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
    historySection: {
      padding: SIZES.padding,
    },
    sectionTitle: {
      fontSize: 20,
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
        <Text style={styles.title}>My Attendance</Text>
        <Text style={styles.subtitle}>{new Date().toDateString()}</Text>
      </View>

      <View style={styles.dashboardCard}>
        <Text style={styles.timeDisplay}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.statusText}>
          {todayStatus.isActive ? 'Currently Clocked In' : 'Currently Clocked Out'}
        </Text>
        
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.punchBtn, { backgroundColor: todayStatus.checkIn ? theme.border : theme.success }]}
            onPress={checkIn}
            disabled={!!todayStatus.checkIn}
          >
            <Text style={[styles.punchBtnText, todayStatus.checkIn && {color: theme.textSecondary}]}>Check In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.punchBtn, { backgroundColor: (!todayStatus.checkIn || todayStatus.checkOut) ? theme.border : theme.danger }]}
            onPress={checkOut}
            disabled={!todayStatus.checkIn || !!todayStatus.checkOut}
          >
            <Text style={[styles.punchBtnText, (!todayStatus.checkIn || todayStatus.checkOut) && {color: theme.textSecondary}]}>Check Out</Text>
          </TouchableOpacity>
        </View>

        {(todayStatus.checkIn || todayStatus.checkOut) && (
          <View style={{marginTop: 16, flexDirection: 'row', width: '100%', justifyContent: 'space-around'}}>
            <Text style={{color: theme.textSecondary}}>In: {todayStatus.checkIn || '--:--'}</Text>
            <Text style={{color: theme.textSecondary}}>Out: {todayStatus.checkOut || '--:--'}</Text>
          </View>
        )}
      </View>

      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Recent History</Text>
        
        {myRecords.map((record) => (
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
                <Text style={styles.timeLabel}>Total Hours</Text>
                <Text style={[styles.timeValue, {color: theme.primary}]}>{record.hours}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
