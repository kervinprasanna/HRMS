import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import usePerformanceStore from '../../store/usePerformanceStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function ManagePerformanceScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  
  const { employee } = route.params;
  const { addReview, addGoal, addAchievement, reviews, goals, achievements, updateGoalProgress } = usePerformanceStore();
  
  const [activeTab, setActiveTab] = useState('History');
  
  // Review State
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  
  // Goal State
  const [goalTitle, setGoalTitle] = useState('');
  
  // Achievement State
  const [achTitle, setAchTitle] = useState('');

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
    tabContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.surface,
    },
    tabBtn: {
      flex: 1,
      paddingVertical: 14,
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
    content: {
      padding: SIZES.padding,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
      marginBottom: 8,
      marginTop: 16,
    },
    input: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 14,
      borderRadius: SIZES.radius,
      color: theme.text,
      fontSize: 16,
    },
    textArea: {
      height: 120,
      textAlignVertical: 'top',
    },
    submitBtn: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: SIZES.radius,
      alignItems: 'center',
      marginTop: 32,
    },
    submitBtnText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    }
  });

  const handleSubmitReview = () => {
    if (!score || !feedback) {
      Alert.alert('Error', 'Please enter a score and feedback.');
      return;
    }
    addReview({ employeeId: employee.id, score: parseInt(score), feedback });
    Alert.alert('Success', 'Performance review added.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  const handleSubmitGoal = () => {
    if (!goalTitle) {
      Alert.alert('Error', 'Please enter a goal title.');
      return;
    }
    addGoal({ employeeId: employee.id, title: goalTitle });
    Alert.alert('Success', 'Goal assigned to employee.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  const handleSubmitAchievement = () => {
    if (!achTitle) {
      Alert.alert('Error', 'Please enter an achievement title.');
      return;
    }
    addAchievement({ employeeId: employee.id, title: achTitle });
    Alert.alert('Success', 'Achievement logged.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.headerText} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Manage Performance</Text>
            <Text style={{ fontSize: 13, color: theme.textSecondary, marginLeft: 16, marginTop: 2 }}>{employee.name} ({employee.id})</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'History' && styles.tabBtnActive]} onPress={() => setActiveTab('History')}>
          <Text style={[styles.tabText, activeTab === 'History' && styles.tabTextActive]}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'Review' && styles.tabBtnActive]} onPress={() => setActiveTab('Review')}>
          <Text style={[styles.tabText, activeTab === 'Review' && styles.tabTextActive]}>Review</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'Goal' && styles.tabBtnActive]} onPress={() => setActiveTab('Goal')}>
          <Text style={[styles.tabText, activeTab === 'Goal' && styles.tabTextActive]}>Goal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'Achievement' && styles.tabBtnActive]} onPress={() => setActiveTab('Achievement')}>
          <Text style={[styles.tabText, activeTab === 'Achievement' && styles.tabTextActive]}>Award</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {activeTab === 'History' && (
          <View>
            <Text style={[styles.label, {marginTop: 0, fontSize: 16, color: theme.text}]}>Recent Reviews</Text>
            {reviews.filter(r => r.employeeId === employee.id).length === 0 && <Text style={{color: theme.textSecondary}}>No reviews yet.</Text>}
            {reviews.filter(r => r.employeeId === employee.id).map(r => (
              <View key={r.id} style={{backgroundColor: theme.surface, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: theme.border, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: theme.primary}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
                  <Text style={{fontWeight: 'bold', color: theme.text}}>Score: {r.score}</Text>
                  <Text style={{color: theme.textSecondary, fontSize: 12}}>{r.date}</Text>
                </View>
                <Text style={{color: theme.textSecondary}}>{r.feedback}</Text>
              </View>
            ))}

            <Text style={[styles.label, {marginTop: 16, fontSize: 16, color: theme.text}]}>Goals</Text>
            {goals.filter(g => g.employeeId === employee.id).length === 0 && <Text style={{color: theme.textSecondary}}>No goals assigned.</Text>}
            {goals.filter(g => g.employeeId === employee.id).map(g => (
              <View key={g.id} style={{backgroundColor: theme.surface, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: theme.border, marginBottom: 8}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={{fontWeight: 'bold', color: theme.text, flex: 1}}>{g.title}</Text>
                  <Text style={{color: g.status === 'Completed' ? theme.success : theme.warning, fontSize: 12, fontWeight: 'bold'}}>{g.status} ({g.progress}%)</Text>
                </View>
                {g.status !== 'Completed' && (
                  <View style={{flexDirection: 'row', marginTop: 12}}>
                    <TouchableOpacity 
                      onPress={() => updateGoalProgress(g.id, 50)} 
                      style={{backgroundColor: theme.primary + '20', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginRight: 8}}
                    >
                      <Text style={{fontSize: 12, color: theme.primary, fontWeight: 'bold'}}>Mark 50%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => updateGoalProgress(g.id, 100)} 
                      style={{backgroundColor: theme.success + '20', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6}}
                    >
                      <Text style={{fontSize: 12, color: theme.success, fontWeight: 'bold'}}>Mark Completed</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
        
        {activeTab === 'Review' && (
          <View>
            <Text style={styles.label}>Performance Score (0-100)</Text>
            <TextInput 
              style={styles.input}
              placeholder="e.g. 85"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              value={score}
              onChangeText={setScore}
            />
            
            <Text style={styles.label}>Feedback / Notes</Text>
            <TextInput 
              style={[styles.input, styles.textArea]}
              placeholder="Enter review feedback..."
              placeholderTextColor={theme.textSecondary}
              multiline
              value={feedback}
              onChangeText={setFeedback}
            />
            
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitReview}>
              <Text style={styles.submitBtnText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'Goal' && (
          <View>
            <Text style={styles.label}>New Goal Title</Text>
            <TextInput 
              style={styles.input}
              placeholder="e.g. Complete AWS Certification"
              placeholderTextColor={theme.textSecondary}
              value={goalTitle}
              onChangeText={setGoalTitle}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitGoal}>
              <Text style={styles.submitBtnText}>Assign Goal</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'Achievement' && (
          <View>
            <Text style={styles.label}>Achievement Title</Text>
            <TextInput 
              style={styles.input}
              placeholder="e.g. Employee of the Month"
              placeholderTextColor={theme.textSecondary}
              value={achTitle}
              onChangeText={setAchTitle}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitAchievement}>
              <Text style={styles.submitBtnText}>Log Achievement</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </View>
  );
}
