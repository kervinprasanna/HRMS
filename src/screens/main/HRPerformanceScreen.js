import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useEmployeeStore from '../../store/useEmployeeStore';
import usePerformanceStore from '../../store/usePerformanceStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function HRPerformanceScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  
  const { employees } = useEmployeeStore();
  const { getEmployeeScore } = usePerformanceStore();
  const [searchQuery, setSearchQuery] = useState('');

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
    scoreBadge: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scoreText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFF',
    }
  });

  const getScoreColor = (val) => {
    if (val === 0) return theme.textSecondary; // No score
    if (val >= 90) return theme.success;
    if (val >= 75) return theme.primary;
    if (val >= 60) return theme.warning;
    return theme.danger;
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const score = getEmployeeScore(item.id);
    const scoreColor = getScoreColor(score);

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('ManagePerformance', { employee: item })}
      >
        <View style={{flex: 1}}>
          <Text style={styles.empName}>{item.name}</Text>
          <Text style={styles.empDept}>{item.id} • {item.dept}</Text>
        </View>

        <View style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
          <Text style={styles.scoreText}>{score > 0 ? score : '-'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.headerText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Performance Tracking</Text>
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
