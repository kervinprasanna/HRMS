import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../../store/useAuthStore';
import useThemeStore from '../../store/useThemeStore';
import usePayrollStore from '../../store/usePayrollStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function SalaryHistoryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const { payslips } = usePayrollStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  
  const isHR = user?.role === 'HR';
  const targetEmployee = route.params?.employee;
  const employeeName = targetEmployee?.name || user?.name || 'Employee';
  const employeeId = targetEmployee?.id || user?.id || 'EMP-2048'; // Fallback to current user's ID
  
  const employeePayslips = payslips.filter(p => p.employeeId === employeeId);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      padding: SIZES.padding,
      paddingTop: Math.max(insets.top, SIZES.padding),
      backgroundColor: theme.headerBackground,
      
      
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
    subtitle: {
      fontSize: SIZES.md,
      color: theme.headerText,Secondary,
      marginLeft: 40,
      marginTop: 4,
    },
    list: {
      padding: SIZES.padding,
    },
    card: {
      backgroundColor: theme.surface,
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
      marginBottom: SIZES.padding,
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    monthText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    netText: {
      fontSize: 16,
      color: theme.primary,
      fontWeight: '600',
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: theme.success + '20',
      alignItems: 'center',
      marginBottom: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.success,
    },
    fab: {
      position: 'absolute',
      right: SIZES.padding,
      bottom: SIZES.padding * 2,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    }
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Payslip', { payslip: item, employeeName })}
    >
      <View>
        <Text style={styles.monthText}>{item.month}</Text>
        <Text style={styles.netText}>{item.net}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <Text style={{color: theme.textSecondary, fontSize: 12}}>Paid on {item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.headerText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Salary History</Text>
        </View>
        <Text style={styles.subtitle}>{employeeName}</Text>
      </View>
      
      <FlatList 
        data={employeePayslips}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      
      {isHR && (
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreatePayslip', { employee: targetEmployee })}>
          <Ionicons name="add" size={32} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}
