import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useRecruitmentStore from '../../store/useRecruitmentStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function RecruitmentScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const { jobs, candidates } = useRecruitmentStore();
  const [activeTab, setActiveTab] = useState('Jobs');

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
    tabContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    tabBtn: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
    },
    tabBtnActive: {
      borderBottomWidth: 3,
      borderBottomColor: theme.primary,
    },
    tabText: {
      fontSize: SIZES.md,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    tabTextActive: {
      color: theme.primary,
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
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    cardSubtitle: {
      fontSize: 14,
      color: theme.headerText,Secondary,
      marginBottom: 12,
    },
    badgeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: theme.primary + '20',
    },
    badgeText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.primary,
    }
  });

  const renderJob = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSubtitle}>{item.department} • {item.location}</Text>
      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: theme.success + '20' }]}>
          <Text style={[styles.badgeText, { color: theme.success }]}>{item.status}</Text>
        </View>
        <Text style={{color: theme.text, fontWeight: '500'}}>{item.applicants} Candidates</Text>
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Selected': return theme.success;
      case 'Rejected': return theme.danger;
      case 'Interview': return theme.warning;
      case 'Shortlisted': return theme.primary;
      default: return theme.textSecondary;
    }
  };

  const renderCandidate = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CandidateDetail', { candidate: item })}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>Applied for: {item.role}</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{item.status}</Text>
          </View>
          <Text style={{color: theme.primary, fontWeight: 'bold'}}>Review ➔</Text>
        </View>
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
          <Text style={styles.headerTitle}>Recruitment</Text>
        </View>
        {activeTab === 'Jobs' && (
          <TouchableOpacity onPress={() => navigation.navigate('CreateJob')}>
            <Ionicons name="add-circle" size={32} color={theme.primary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'Jobs' && styles.tabBtnActive]} onPress={() => setActiveTab('Jobs')}>
          <Text style={[styles.tabText, activeTab === 'Jobs' && styles.tabTextActive]}>Job Openings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'Candidates' && styles.tabBtnActive]} onPress={() => setActiveTab('Candidates')}>
          <Text style={[styles.tabText, activeTab === 'Candidates' && styles.tabTextActive]}>Candidates</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList 
        data={activeTab === 'Jobs' ? jobs : candidates}
        renderItem={activeTab === 'Jobs' ? renderJob : renderCandidate}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}
