import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useAuthStore from '../../store/useAuthStore';
import usePerformanceStore from '../../store/usePerformanceStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function PerformanceDashboardScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const { user } = useAuthStore();
  
  const { reviews, goals, achievements, getEmployeeScore } = usePerformanceStore();
  
  const empId = user?.id || 'EMP-2048';
  const score = getEmployeeScore(empId);
  const myGoals = goals.filter(g => g.employeeId === empId);
  const myReviews = reviews.filter(r => r.employeeId === empId);
  const myAchievements = achievements.filter(a => a.employeeId === empId);

  const getScoreColor = (val) => {
    if (val >= 90) return theme.success;
    if (val >= 75) return theme.primary;
    if (val >= 60) return theme.warning;
    return theme.danger;
  };
  const scoreColor = getScoreColor(score);

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
    content: {
      padding: SIZES.padding,
    },
    scoreCard: {
      backgroundColor: theme.surface,
      padding: SIZES.padding * 2,
      borderRadius: SIZES.radius * 2,
      alignItems: 'center',
      marginBottom: SIZES.padding * 2,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 4,
      shadowColor: scoreColor,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
    },
    gaugeOuter: {
      width: 160,
      height: 160,
      borderRadius: 80,
      borderWidth: 8,
      borderColor: scoreColor + '30',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    gaugeInner: {
      width: 144,
      height: 144,
      borderRadius: 72,
      borderWidth: 8,
      borderColor: scoreColor,
      justifyContent: 'center',
      alignItems: 'center',
      borderLeftColor: scoreColor + '30', // creates a semi-filled effect
      transform: [{ rotate: '45deg' }],
    },
    scoreTextWrapper: {
      transform: [{ rotate: '-45deg' }],
      alignItems: 'center',
    },
    scoreValue: {
      fontSize: 48,
      fontWeight: 'bold',
      color: theme.text,
    },
    scoreLabel: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: '600',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: SIZES.padding,
    },
    goalCard: {
      backgroundColor: theme.surface,
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
      marginBottom: SIZES.padding,
      borderWidth: 1,
      borderColor: theme.border,
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    goalTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
    },
    goalStatus: {
      fontSize: 12,
      fontWeight: 'bold',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      overflow: 'hidden',
    },
    progressTrack: {
      height: 8,
      backgroundColor: theme.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: 4,
    },
    reviewCard: {
      backgroundColor: theme.surface,
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
      marginBottom: SIZES.padding,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.headerText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Performance</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.scoreCard}>
          <View style={styles.gaugeOuter}>
            <View style={styles.gaugeInner}>
              <View style={styles.scoreTextWrapper}>
                <Text style={styles.scoreValue}>{score}</Text>
                <Text style={styles.scoreLabel}>Score</Text>
              </View>
            </View>
          </View>
          <Text style={{fontSize: 16, color: theme.textSecondary}}>
            {score >= 90 ? 'Outstanding Performance 🌟' : score >= 75 ? 'Good Progress 👍' : 'Needs Improvement 📈'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Active Goals</Text>
        {myGoals.map(goal => (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={[styles.goalStatus, {
                backgroundColor: goal.status === 'Completed' ? theme.success + '20' : theme.warning + '20',
                color: goal.status === 'Completed' ? theme.success : theme.warning
              }]}>
                {goal.status}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${goal.progress}%`, backgroundColor: goal.status === 'Completed' ? theme.success : theme.primary }]} />
            </View>
            <Text style={{textAlign: 'right', marginTop: 4, fontSize: 12, color: theme.textSecondary}}>{goal.progress}%</Text>
          </View>
        ))}

        <Text style={[styles.sectionTitle, {marginTop: 16}]}>Recent Reviews & Feedback</Text>
        {myReviews.map(review => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
              <Text style={{fontWeight: 'bold', color: theme.text}}>Q-Review</Text>
              <Text style={{color: theme.textSecondary, fontSize: 12}}>{review.date}</Text>
            </View>
            <Text style={{color: theme.text, lineHeight: 20}}>{review.feedback}</Text>
          </View>
        ))}

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}
