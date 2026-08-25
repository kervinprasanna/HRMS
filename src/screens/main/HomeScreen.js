import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuthStore from '../../store/useAuthStore';
import useThemeStore from '../../store/useThemeStore';
import useAttendanceStore from '../../store/useAttendanceStore';
import { COLORS, SIZES } from '../../constants/theme';

const ProgressBar = ({ progress, color, height = 8 }) => (
  <View style={{ height, backgroundColor: color + '30', borderRadius: height / 2, overflow: 'hidden', marginTop: 8 }}>
    <View style={{ height, width: `${progress}%`, backgroundColor: color, borderRadius: height / 2 }} />
  </View>
);

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const { todayStatus, checkIn, checkOut } = useAttendanceStore();
  const insets = useSafeAreaInsets();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const isHR = user?.role === 'HR';

  const [toastMessage, setToastMessage] = useState(null);
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const showToast = (message) => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: insets.top + 10, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(slideAnim, { toValue: -100, duration: 300, useNativeDriver: true })
    ]).start(() => setToastMessage(null));
  };

  const handlePunch = () => {
    if (todayStatus.isActive) {
      checkOut();
      showToast("Successfully Punched Out! Have a great day.");
    } else {
      checkIn();
      showToast("Successfully Punched In! Have a productive day.");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: SIZES.padding,
      paddingBottom: SIZES.padding,
      paddingTop: Math.max(insets.top, SIZES.padding),
      backgroundColor: theme.headerBackground,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerProfile: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarPlaceholder: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255,255,255,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      fontSize: 20,
      color: theme.headerText,
      fontWeight: 'bold',
    },
    greeting: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.headerText,
    },
    roleBadge: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      marginTop: 4,
      alignSelf: 'flex-start',
    },
    roleText: {
      color: theme.headerText,
      fontWeight: '600',
      fontSize: 12,
    },
    content: {
      padding: SIZES.padding,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: SIZES.padding,
      marginTop: SIZES.padding,
      paddingHorizontal: SIZES.padding,
    },
    cardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: SIZES.padding,
      paddingHorizontal: SIZES.padding,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.surface,
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    statValue: {
      fontSize: 26,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    widgetCard: {
      backgroundColor: theme.surface,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      marginHorizontal: SIZES.padding,
      marginBottom: SIZES.padding,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    widgetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    widgetTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    widgetSubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 2,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      paddingHorizontal: 8,
      marginTop: 8,
    },
    gridItem: {
      width: '25%',
      alignItems: 'center',
      marginBottom: 16,
    },
    iconWrapper: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 2,
      marginBottom: 8,
    },
    gridLabel: {
      fontSize: 11,
      color: theme.text,
      textAlign: 'center',
      fontWeight: '500',
    },
    announcementBanner: {
      backgroundColor: theme.primary + '15',
      marginHorizontal: SIZES.padding,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SIZES.padding,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    punchBtn: {
      backgroundColor: theme.primary,
      paddingVertical: 14,
      borderRadius: SIZES.radius,
      alignItems: 'center',
      marginTop: SIZES.padding,
    },
    punchBtnText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    listRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    toastContainer: {
      position: 'absolute',
      top: 0,
      left: SIZES.padding,
      right: SIZES.padding,
      backgroundColor: theme.success,
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 6,
      zIndex: 999,
    }
  });

  const renderHRDashboard = () => {
    const hrModules = [
      { id: '1', name: 'Employees', icon: 'people-outline', route: 'EmployeeList', color: '#2196F3' },
      { id: '2', name: 'Request', icon: 'calendar-outline', route: 'Requests', isTab: true, color: '#FF9800' },
      { id: '3', name: 'Recruit', icon: 'briefcase-outline', route: 'Recruitment', color: '#4CAF50' },
      { id: '4', name: 'Assets', icon: 'laptop-outline', route: 'Assets', color: '#9C27B0' },
      { id: '5', name: 'Payroll', icon: 'cash-outline', route: 'Payroll', color: '#F44336' },
      { id: '6', name: 'Attendance', icon: 'time-outline', route: 'HRAttendance', color: '#00BCD4' },
      { id: '7', name: 'Credentials', icon: 'document-lock-outline', route: 'Credentials', color: '#FFEB3B' },
      { id: '8', name: 'Performance', icon: 'trending-up-outline', route: 'HRPerformance', color: '#607D8B' },
      { id: '9', name: 'LMS & EE', icon: 'library-outline', route: 'LMSEE', color: '#E91E63' },
    ];

    return (
      <>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.gridContainer}>
          {hrModules.map((mod) => (
            <TouchableOpacity 
              key={mod.id} 
              style={styles.gridItem}
              onPress={() => {
                if (mod.route) {
                  mod.isTab ? navigation.navigate('MainTabs', { screen: mod.route }) : navigation.navigate(mod.route);
                }
              }}
            >
              <View style={[styles.iconWrapper, { borderColor: mod.color + '40', backgroundColor: mod.color + '10' }]}>
                <Ionicons name={mod.icon} size={26} color={mod.color} />
              </View>
              <Text style={styles.gridLabel} numberOfLines={1}>{mod.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>
        
        {/* Core Stats */}
        <View style={styles.cardRow}>
          <View style={styles.statCard}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={styles.statValue}>142</Text>
              <Ionicons name="people" size={20} color={theme.primary} />
            </View>
            <Text style={styles.statLabel}>Total Employees</Text>
          </View>
          <View style={styles.statCard}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={styles.statValue}>128</Text>
              <Ionicons name="checkmark-circle" size={20} color={theme.success} />
            </View>
            <Text style={styles.statLabel}>Present Today</Text>
          </View>
        </View>
        <View style={styles.cardRow}>
          <View style={styles.statCard}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={[styles.statValue, { color: theme.warning }]}>14</Text>
              <Ionicons name="close-circle" size={20} color={theme.warning} />
            </View>
            <Text style={styles.statLabel}>Absent Today</Text>
          </View>
          <View style={styles.statCard}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={[styles.statValue, { color: theme.danger }]}>7</Text>
              <Ionicons name="time" size={20} color={theme.danger} />
            </View>
            <Text style={styles.statLabel}>Pending Requests</Text>
          </View>
        </View>

        {/* Recruitment Status */}
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <Text style={styles.widgetTitle}>Recruitment Status</Text>
            <Ionicons name="briefcase" size={20} color={theme.textSecondary} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Open Roles</Text>
            </View>
            <View>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Active Candidates</Text>
            </View>
            <View>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Interviews</Text>
            </View>
          </View>
        </View>

        {/* Pending Approvals */}
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <Text style={styles.widgetTitle}>Pending Approvals</Text>
            <Ionicons name="alert-circle" size={20} color={theme.warning} />
          </View>
          <View style={styles.listRow}>
            <View>
              <Text style={{fontWeight: '600', color: theme.text}}>Sick Leave - John Doe</Text>
              <Text style={{fontSize: 12, color: theme.textSecondary}}>2 Days (Aug 28 - Aug 29)</Text>
            </View>
            <TouchableOpacity style={{backgroundColor: theme.primary+'20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4}}>
              <Text style={{color: theme.primary, fontWeight: 'bold', fontSize: 12}}>Review</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.listRow, {borderBottomWidth: 0}]}>
            <View>
              <Text style={{fontWeight: '600', color: theme.text}}>Travel Expense - S. Smith</Text>
              <Text style={{fontSize: 12, color: theme.textSecondary}}>₹ 4,500.00</Text>
            </View>
            <TouchableOpacity style={{backgroundColor: theme.primary+'20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4}}>
              <Text style={{color: theme.primary, fontWeight: 'bold', fontSize: 12}}>Review</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Asset Information */}
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <Text style={styles.widgetTitle}>Asset Information</Text>
            <Ionicons name="laptop" size={20} color={theme.textSecondary} />
          </View>
          <Text style={{fontWeight: '600', color: theme.text}}>Laptops</Text>
          <ProgressBar progress={90} color={theme.primary} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 4}}>
            <Text style={{fontSize: 12, color: theme.textSecondary}}>45 Assigned</Text>
            <Text style={{fontSize: 12, color: theme.textSecondary}}>5 Available</Text>
          </View>
        </View>

        {/* Performance & Training Overview */}
        <View style={{flexDirection: 'row', paddingHorizontal: SIZES.padding, marginBottom: SIZES.padding}}>
          <View style={[styles.widgetCard, {flex: 1, marginHorizontal: 0, marginRight: 8, marginBottom: 0}]}>
            <Text style={[styles.widgetTitle, {fontSize: 14}]}>Avg Rating</Text>
            <Text style={[styles.statValue, {color: theme.success, marginTop: 8}]}>4.2 <Text style={{fontSize: 16}}>⭐️</Text></Text>
            <Text style={{fontSize: 12, color: theme.textSecondary}}>Company Wide</Text>
          </View>
          <View style={[styles.widgetCard, {flex: 1, marginHorizontal: 0, marginLeft: 8, marginBottom: 0}]}>
            <Text style={[styles.widgetTitle, {fontSize: 14}]}>Training</Text>
            <Text style={[styles.statValue, {color: theme.primary, marginTop: 8}]}>78%</Text>
            <Text style={{fontSize: 12, color: theme.textSecondary}}>Completion Rate</Text>
          </View>
        </View>
      </>
    );
  };

  const renderEmployeeDashboard = () => {
    const modules = [
      { id: '1', name: 'Attendance', icon: 'time-outline', route: 'Attendance', color: '#4CAF50' },
      { id: '2', name: 'Leave', icon: 'calendar-outline', route: 'CreateRequest', color: '#FF9800' },
      { id: '3', name: 'ID Card', icon: 'id-card-outline', route: 'Profile', color: '#2196F3' },
      { id: '4', name: 'Assets', icon: 'laptop-outline', route: 'Assets', color: '#9C27B0' },
      { id: '5', name: 'Payroll', icon: 'cash-outline', route: 'SalaryHistory', color: '#F44336' },
      { id: '6', name: 'Help Desk', icon: 'headset-outline', route: null, color: '#00BCD4' },
      { id: '7', name: 'Performance', icon: 'trending-up-outline', route: 'PerformanceDashboard', color: '#607D8B' },
      { id: '8', name: 'LMS & EE', icon: 'library-outline', route: 'LMSEE', color: '#E91E63' },
    ];

    return (
      <>
        {/* Announcement Banner */}
        <View style={styles.announcementBanner}>
          <Ionicons name="megaphone" size={24} color={theme.primary} style={{marginRight: 12}} />
          <View style={{flex: 1}}>
            <Text style={{fontWeight: 'bold', color: theme.primary}}>Company Announcement</Text>
            <Text style={{fontSize: 12, color: theme.text, marginTop: 2}}>Upcoming Public Holiday on Friday. Enjoy your long weekend!</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, {marginTop: 0}]}>Quick Actions</Text>
        <View style={styles.gridContainer}>
          {modules.map((mod) => (
            <TouchableOpacity 
              key={mod.id} 
              style={styles.gridItem}
              onPress={() => mod.route ? navigation.navigate(mod.route) : null}
            >
              <View style={[styles.iconWrapper, { borderColor: mod.color + '40', backgroundColor: mod.color + '10' }]}>
                <Ionicons name={mod.icon} size={26} color={mod.color} />
              </View>
              <Text style={styles.gridLabel} numberOfLines={1}>{mod.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Live Attendance</Text>
        <View style={styles.widgetCard}>
          <View style={{alignItems: 'center', marginBottom: 16}}>
            <Text style={{fontSize: 14, color: theme.primary, fontWeight: 'bold'}}>Working Hours</Text>
            <Text style={{fontSize: 28, color: theme.text, fontWeight: 'bold'}}>
              {todayStatus.isActive ? '04h 12m' : '00h 00m'}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <View>
              <Text style={{ color: theme.text, fontWeight: '600' }}>Start Time</Text>
              <Text style={{ color: theme.textSecondary, marginTop: 4 }}>
                {todayStatus.checkIn || '--:--'}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: theme.text, fontWeight: '600' }}>End Time</Text>
              <Text style={{ color: theme.textSecondary, marginTop: 4 }}>
                {todayStatus.checkOut || '--:--'}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.punchBtn, { backgroundColor: todayStatus.isActive ? theme.danger : theme.primary }]}
            onPress={handlePunch}
          >
            <Text style={styles.punchBtnText}>{todayStatus.isActive ? 'Punch Out' : 'Punch In'}</Text>
          </TouchableOpacity>
        </View>

        {/* My Pending Requests */}
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <Text style={styles.widgetTitle}>My Pending Requests</Text>
            <Ionicons name="time" size={20} color={theme.warning} />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View>
              <Text style={{fontWeight: '600', color: theme.text}}>Sick Leave</Text>
              <Text style={{fontSize: 12, color: theme.textSecondary}}>Aug 28 - Aug 29</Text>
            </View>
            <View style={{backgroundColor: theme.warning+'20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4}}>
              <Text style={{color: theme.warning, fontSize: 12, fontWeight: 'bold'}}>Pending</Text>
            </View>
          </View>
        </View>

        {/* Training Progress */}
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <Text style={styles.widgetTitle}>Training Progress</Text>
            <Ionicons name="school" size={20} color={theme.textSecondary} />
          </View>
          <Text style={{fontWeight: '600', color: theme.text}}>React Native Advanced</Text>
          <ProgressBar progress={65} color={theme.primary} />
          <Text style={{fontSize: 12, color: theme.textSecondary, marginTop: 4, textAlign: 'right'}}>65% Complete</Text>
        </View>

        {/* Assigned Assets */}
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <Text style={styles.widgetTitle}>Assigned Assets</Text>
            <Ionicons name="laptop" size={20} color={theme.textSecondary} />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="hardware-chip" size={24} color={theme.primary} style={{marginRight: 12}} />
            <View>
              <Text style={{fontWeight: '600', color: theme.text}}>MacBook Pro M2</Text>
              <Text style={{fontSize: 12, color: theme.textSecondary}}>Serial: XYZ-1234-5678</Text>
            </View>
          </View>
        </View>
        
        <View style={{height: 20}} />
      </>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerProfile}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Hi, {user?.name}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user?.role} Portal</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{flex: 1, paddingVertical: SIZES.padding}}>
        {isHR ? renderHRDashboard() : renderEmployeeDashboard()}
      </View>
      <View style={{height: 40}} />
      
      {toastMessage && (
        <Animated.View style={[styles.toastContainer, { transform: [{ translateY: slideAnim }] }]}>
          <Ionicons name="checkmark-circle" size={24} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{toastMessage}</Text>
        </Animated.View>
      )}
    </ScrollView>
  );
}
