import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useEmployeeStore from '../../store/useEmployeeStore';
import useAttendanceStore from '../../store/useAttendanceStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function HRAttendanceScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  
  const { employees } = useEmployeeStore();
  const { attendanceRecords } = useAttendanceStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('Daily'); // Daily or Monthly
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date'); // 'date' for both, we'll format output based on filterType

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
      justifyContent: 'space-between',
      alignItems: 'center',
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
    searchContainer: {
      padding: SIZES.padding,
      backgroundColor: theme.surface,
    },
    searchInput: {
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 12,
      borderRadius: SIZES.radius,
      color: theme.text,
      fontSize: SIZES.md,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.background,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      width: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SIZES.padding,
    },
    filterOption: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    filterOptionActive: {
      borderBottomColor: theme.primary,
    },
    filterOptionText: {
      fontSize: SIZES.md,
      color: theme.text,
    },
    filterOptionTextActive: {
      color: theme.primary,
      fontWeight: 'bold',
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
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    empName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    empDept: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      alignItems: 'center',
      minWidth: 80,
    },
    statusText: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    monthlyStats: {
      alignItems: 'flex-end',
    },
    statsText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text,
    },
    statsLabel: {
      fontSize: 12,
      color: theme.textSecondary,
    }
  });

  const getTodayStatus = (employeeId) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const record = attendanceRecords.find(r => (r.employeeId === employeeId || r.employeeId === 'EMP-2048') && r.date === formattedDate); 
    
    if (record) {
      return record.status; 
    }
    // Random mock based on date to show variation when changing dates
    const mockStatuses = ['Present', 'Absent', 'Late'];
    return mockStatuses[(employeeId.length + selectedDate.getDate()) % 3]; 
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const openPicker = (type) => {
    setFilterType(type);
    setShowFilterModal(false);
    setShowPicker(true);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const status = getTodayStatus(item.id);
    
    let statusColor = theme.textSecondary;
    if (status === 'Present') statusColor = theme.success;
    if (status === 'Absent') statusColor = theme.danger;
    if (status === 'Late') statusColor = theme.warning;

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('AttendanceDetail', { employee: item })}
      >
        <View style={{flex: 1}}>
          <Text style={styles.empName}>{item.name}</Text>
          <Text style={styles.empDept}>{item.id} • {item.dept}</Text>
        </View>

        {filterType === 'Daily' ? (
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
          </View>
        ) : (
          <View style={styles.monthlyStats}>
            <Text style={[styles.statsText, { color: theme.success }]}>21 Days</Text>
            <Text style={styles.statsLabel}>Present</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.headerText} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Attendance Log</Text>
            <Text style={{ fontSize: 13, color: theme.textSecondary, marginLeft: 16, marginTop: 2 }}>
              {filterType === 'Daily' 
                ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                : selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              }
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <Ionicons name="funnel-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search employees..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList 
        data={filteredEmployees}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      
      <Modal visible={showFilterModal} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={{fontSize: 18, fontWeight: 'bold', color: theme.text}}>Select Filter</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={[styles.filterOption, filterType === 'Daily' && styles.filterOptionActive]} 
              onPress={() => openPicker('Daily')}
            >
              <Text style={[styles.filterOptionText, filterType === 'Daily' && styles.filterOptionTextActive]}>Pick a Date</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, filterType === 'Monthly' && styles.filterOptionActive]} 
              onPress={() => openPicker('Monthly')}
            >
              <Text style={[styles.filterOptionText, filterType === 'Monthly' && styles.filterOptionTextActive]}>Pick a Month</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          onChange={handleDateChange}
          themeVariant={isDarkMode ? "dark" : "light"}
        />
      )}
      
      {Platform.OS === 'ios' && showPicker && (
        <TouchableOpacity 
          style={{backgroundColor: theme.primary, padding: 16, alignItems: 'center'}}
          onPress={() => setShowPicker(false)}
        >
          <Text style={{color: '#FFF', fontWeight: 'bold'}}>Done</Text>
        </TouchableOpacity>
      )}

    </View>
  );
}
