import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useLMSStore from '../../store/useLMSStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function CreateEngagementScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  
  const { addAnnouncement, addPoll } = useLMSStore();
  
  const [activeTab, setActiveTab] = useState('Announcement');
  
  // Announcement State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  
  // Poll State
  const [pollQuestion, setPollQuestion] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');

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
      borderBottomColor: '#E91E63',
    },
    tabText: {
      fontSize: SIZES.md,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    tabTextActive: {
      color: '#E91E63',
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
      backgroundColor: '#E91E63',
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

  const handleSubmitAnnouncement = () => {
    if (!annTitle || !annContent) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    addAnnouncement({ title: annTitle, content: annContent });
    Alert.alert('Success', 'Announcement posted!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  const handleSubmitPoll = () => {
    if (!pollQuestion || !opt1 || !opt2) {
      Alert.alert('Error', 'Please enter a question and at least two options.');
      return;
    }
    const options = [opt1, opt2];
    if (opt3) options.push(opt3);
    
    addPoll({ question: pollQuestion, options });
    Alert.alert('Success', 'Poll posted!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.headerText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Engagement Post</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'Announcement' && styles.tabBtnActive]} onPress={() => setActiveTab('Announcement')}>
          <Text style={[styles.tabText, activeTab === 'Announcement' && styles.tabTextActive]}>Announcement</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'Poll' && styles.tabBtnActive]} onPress={() => setActiveTab('Poll')}>
          <Text style={[styles.tabText, activeTab === 'Poll' && styles.tabTextActive]}>Poll</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {activeTab === 'Announcement' && (
          <View>
            <Text style={styles.label}>Title</Text>
            <TextInput 
              style={styles.input}
              placeholder="e.g. Q4 Townhall Meeting"
              placeholderTextColor={theme.textSecondary}
              value={annTitle}
              onChangeText={setAnnTitle}
            />
            
            <Text style={styles.label}>Content</Text>
            <TextInput 
              style={[styles.input, styles.textArea]}
              placeholder="Enter details..."
              placeholderTextColor={theme.textSecondary}
              multiline
              value={annContent}
              onChangeText={setAnnContent}
            />
            
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitAnnouncement}>
              <Text style={styles.submitBtnText}>Post Announcement</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'Poll' && (
          <View>
            <Text style={styles.label}>Poll Question</Text>
            <TextInput 
              style={styles.input}
              placeholder="e.g. Where should we go for lunch?"
              placeholderTextColor={theme.textSecondary}
              value={pollQuestion}
              onChangeText={setPollQuestion}
            />
            
            <Text style={styles.label}>Option 1</Text>
            <TextInput style={styles.input} placeholder="Option 1" placeholderTextColor={theme.textSecondary} value={opt1} onChangeText={setOpt1} />
            
            <Text style={styles.label}>Option 2</Text>
            <TextInput style={styles.input} placeholder="Option 2" placeholderTextColor={theme.textSecondary} value={opt2} onChangeText={setOpt2} />
            
            <Text style={styles.label}>Option 3 (Optional)</Text>
            <TextInput style={styles.input} placeholder="Option 3" placeholderTextColor={theme.textSecondary} value={opt3} onChangeText={setOpt3} />
            
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitPoll}>
              <Text style={styles.submitBtnText}>Post Poll</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </View>
  );
}
