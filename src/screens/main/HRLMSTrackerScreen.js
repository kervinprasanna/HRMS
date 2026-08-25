import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useEmployeeStore from '../../store/useEmployeeStore';
import useLMSStore from '../../store/useLMSStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function HRLMSTrackerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  
  const { employees } = useEmployeeStore();
  const { courses, enrollments } = useLMSStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedEmp, setSelectedEmp] = useState(null);

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
    searchContainer: {
      padding: SIZES.padding,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
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
    enrollmentItem: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    courseTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    progressTrack: {
      height: 6,
      backgroundColor: theme.border,
      borderRadius: 3,
      overflow: 'hidden',
      marginTop: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: 3,
    },
  });

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const empEnrollments = enrollments.filter(e => e.employeeId === item.id);
    const isExpanded = selectedEmp === item.id;

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => setSelectedEmp(isExpanded ? null : item.id)}
      >
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View>
            <Text style={styles.empName}>{item.name}</Text>
            <Text style={styles.empDept}>{item.id} • Enrolled: {empEnrollments.length}</Text>
          </View>
          <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color={theme.textSecondary} />
        </View>

        {isExpanded && (
          <View style={{marginTop: 8}}>
            {empEnrollments.length === 0 ? (
              <Text style={{color: theme.textSecondary, marginTop: 8}}>No courses enrolled.</Text>
            ) : (
              empEnrollments.map((enr, i) => {
                const course = courses.find(c => c.id === enr.courseId);
                return (
                  <View key={i} style={styles.enrollmentItem}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      <Text style={styles.courseTitle}>{course?.title || 'Unknown Course'}</Text>
                      <Text style={{color: enr.status === 'Completed' ? theme.success : theme.primary, fontSize: 12, fontWeight: 'bold'}}>{enr.status}</Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${enr.progress}%`, backgroundColor: enr.status === 'Completed' ? theme.success : theme.primary }]} />
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.headerText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learning Tracker</Text>
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
    </View>
  );
}
