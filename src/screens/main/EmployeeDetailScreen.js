import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useAuthStore from '../../store/useAuthStore';
import useThemeStore from '../../store/useThemeStore';
import useEmployeeStore from '../../store/useEmployeeStore';
import { COLORS, SIZES } from '../../constants/theme';
import { Alert } from 'react-native';

export default function EmployeeDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { employee: initialEmployee } = route.params;
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const employee = employees.find(e => e.id === initialEmployee.id) || initialEmployee;
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const insets = useSafeAreaInsets();
  const isHR = user?.role === 'HR';

  const details = [
    { label: 'Employee ID', value: employee.id, icon: 'id-card', color: '#2196F3' },
    { label: 'Email', value: `${employee.name.split(' ')[0].toLowerCase()}@aioninnotech.com`, icon: 'mail', color: '#F44336' },
    { label: 'Department', value: employee.dept, icon: 'business', color: '#FF9800' },
    { label: 'Official Email', value: `${employee.name.split(' ')[0].toLowerCase()}@aioninnotech.com`, icon: 'mail-open', color: '#9C27B0' },
    { label: 'Work Location', value: 'Bhubaneswar', icon: 'location', color: '#795548' },
    { label: 'Reporting Manager', value: 'Banita Maharana', icon: 'person', color: '#4CAF50' },
    { label: 'Date Of Joining', value: '14-10-2024', icon: 'calendar', color: '#9C27B0' },
    { label: 'Emp Type', value: 'Permanent', icon: 'document-text', color: '#607D8B' },
    { label: 'Marital Status', value: 'Unmarried', icon: 'grid', color: '#3F51B5' },
    { label: 'Current Address', value: '1124543212', icon: 'business', color: '#E91E63' },
    { label: 'Documents', value: 'Offer_Letter.pdf', icon: 'document-attach', color: '#FF5722' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
      paddingTop: insets.top,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SIZES.padding,
      paddingVertical: SIZES.padding,
      marginBottom: SIZES.padding,
    },
    avatarPlaceholder: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#FFFFFF30',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 16,
    },
    avatarText: {
      fontSize: 24,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginLeft: 12,
    },
    content: {
      paddingHorizontal: SIZES.padding * 1.5,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SIZES.padding * 1.5,
    },
    iconWrapper: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.primary,
      marginBottom: 2,
    },
    value: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    actionBtns: {
      marginTop: SIZES.padding,
      marginBottom: SIZES.padding * 4,
    }
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[isDarkMode ? '#065F46' : '#10B981', theme.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color={theme.headerText} />
            </TouchableOpacity>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{employee.name.charAt(0)}</Text>
            </View>
            <Text style={styles.headerTitle}>{employee.name}</Text>
            <View style={{ flex: 1 }} />
            {isHR && (
              <TouchableOpacity onPress={() => navigation.navigate('AddEmployee', { employee })}>
                <Ionicons name="pencil" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.content}>
            {details.map((item, index) => {
              const isDocument = item.label === 'Documents';
              return (
              <TouchableOpacity 
                key={index} 
                style={styles.listItem}
                disabled={!isDocument}
                onPress={() => isDocument ? Alert.alert('Document Viewer', 'Opening Offer_Letter.pdf...') : null}
              >
                <View style={[styles.iconWrapper, { backgroundColor: isDarkMode ? theme.surface : '#FFFFFF', elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2 }]}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={[styles.value, isDocument && { color: item.color, textDecorationLine: 'underline' }]}>{item.value}</Text>
                </View>
              </TouchableOpacity>
            )})}

            <View style={styles.actionBtns}>
              <TouchableOpacity 
                style={{backgroundColor: theme.primary, padding: 16, borderRadius: SIZES.radius, alignItems: 'center', marginBottom: 12}}
                onPress={() => navigation.navigate('SalaryHistory', { employee })}
              >
                <Text style={{color: '#FFF', fontWeight: 'bold', fontSize: 16}}>View Salary History</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={{backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.primary, padding: 16, borderRadius: SIZES.radius, alignItems: 'center'}}
                onPress={() => navigation.navigate('AttendanceDetail', { employee })}
              >
                <Text style={{color: theme.primary, fontWeight: 'bold', fontSize: 16}}>View Attendance Log</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
