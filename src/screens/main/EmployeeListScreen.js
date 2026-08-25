import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useAuthStore from '../../store/useAuthStore';
import useEmployeeStore from '../../store/useEmployeeStore';
import EmptyState from '../../components/EmptyState';
import { COLORS, SIZES } from '../../constants/theme';

export default function EmployeeListScreen() {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const { employees, deleteEmployee, fetchEmployees, isLoading } = useEmployeeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const isHR = user?.role === 'HR';

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      marginBottom: SIZES.padding,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.headerText,
      marginLeft: 16,
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
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SIZES.padding,
    },
    avatarText: {
      color: theme.primary,
      fontWeight: 'bold',
      fontSize: 20,
    },
    cardContent: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    role: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 2,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: 6,
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
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    deleteBtn: {
      padding: 8,
      marginLeft: 8,
    }
  });

  const confirmDelete = (employeeId) => {
    Alert.alert('Delete Employee', 'Are you sure you want to remove this employee?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteEmployee(employeeId) }
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('EmployeeDetail', { employee: item })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>{item.id} • {item.dept}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Present' ? theme.success + '20' : theme.danger + '20' }]}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: item.status === 'Present' ? theme.success : theme.danger }}>
            {item.status}
          </Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <Text style={{color: theme.primary, fontSize: 20}}>➔</Text>
        {isHR && (
          <TouchableOpacity style={styles.deleteBtn} onPress={(e) => { e.stopPropagation(); confirmDelete(item.id); }}>
            <Ionicons name="trash-outline" size={20} color={theme.danger} />
          </TouchableOpacity>
        )}
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
          <Text style={styles.headerTitle}>Employees</Text>
        </View>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search by name or ID..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList 
          data={filteredEmployees}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={filteredEmployees.length === 0 ? { flex: 1 } : styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState icon="people-outline" title="No Employees Found" subtitle="Try adjusting your search query." />}
        />
      )}
      
      {isHR && (
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddEmployee')}>
          <Ionicons name="add" size={32} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}
