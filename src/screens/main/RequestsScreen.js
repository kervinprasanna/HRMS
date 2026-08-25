import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../../store/useAuthStore';
import useThemeStore from '../../store/useThemeStore';
import useRequestStore from '../../store/useRequestStore';
import EmptyState from '../../components/EmptyState';
import { COLORS, SIZES } from '../../constants/theme';

export default function RequestsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const { requests } = useRequestStore();
  
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const isHR = user?.role === 'HR';

  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Pending', 'Approved', 'Rejected'];

  // If Employee, only show their own requests. If HR, show all.
  const displayRequests = isHR ? requests : requests.filter(req => req.employeeId === user?.id || req.employeeName === user?.name);
  
  const filteredRequests = displayRequests.filter(req => filter === 'All' || req.status === filter);

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
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.headerText,
      marginLeft: 16,
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
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    reqType: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    reqDate: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    empName: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    filterContainer: {
      paddingHorizontal: SIZES.padding,
      paddingBottom: SIZES.padding,
      backgroundColor: theme.headerBackground,
    },
    filterPill: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
    }
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return theme.success;
      case 'Rejected': return theme.danger;
      case 'Pending': return theme.warning;
      case 'In Progress': return theme.primary;
      default: return theme.textSecondary;
    }
  };

  const renderItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => isHR ? navigation.navigate('RequestDetail', { request: item }) : null}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.reqType}>{item.type}</Text>
          <Text style={styles.reqDate}>{item.date}</Text>
        </View>
        {isHR && <Text style={styles.empName}>{item.employeeName} ({item.employeeId})</Text>}
        <Text style={{color: theme.text}} numberOfLines={1}>{item.description}</Text>
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: statusColor }}>{item.status}</Text>
          </View>
          {isHR && <Text style={{color: theme.primary}}>Review ➔</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.navigate('CreateRequest')}>
            <Ionicons name="arrow-back" size={24} color={theme.headerText} />
          </TouchableOpacity>
          <Text style={styles.title}>Leave List</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map(f => (
            <TouchableOpacity 
              key={f} 
              style={[
                styles.filterPill, 
                { 
                  backgroundColor: filter === f ? theme.text : 'transparent',
                  borderColor: theme.text 
                }
              ]}
              onPress={() => setFilter(f)}
            >
              <Text style={{ color: filter === f ? theme.background : theme.text, fontWeight: '600' }}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <FlatList 
        data={filteredRequests}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={filteredRequests.length === 0 ? { flex: 1 } : styles.list}
        ListEmptyComponent={<EmptyState icon="document-text-outline" title="No Requests Found" subtitle={`You have no ${filter === 'All' ? '' : filter.toLowerCase()} leave requests.`} />}
      />
    </View>
  );
}
