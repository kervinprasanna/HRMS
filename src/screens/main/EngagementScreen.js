import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useAuthStore from '../../store/useAuthStore';
import useLMSStore from '../../store/useLMSStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function EngagementScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const isHR = user?.role === 'HR';
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  
  const { announcements, polls, votePoll } = useLMSStore();

  const [activeTab, setActiveTab] = useState('Announcements');

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
    card: {
      backgroundColor: theme.surface,
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
      marginBottom: SIZES.padding,
      borderWidth: 1,
      borderColor: theme.border,
      borderLeftWidth: 4,
    },
    announcementTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    announcementDate: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 12,
    },
    announcementContent: {
      fontSize: 14,
      color: theme.text,
      lineHeight: 20,
    },
    pollQuestion: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    pollOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.background,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 8,
    },
    pollOptionVoted: {
      borderColor: '#E91E63',
      backgroundColor: '#E91E6310',
    },
    pollFill: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      backgroundColor: '#E91E6320',
      borderRadius: 8,
    },
    pollText: {
      fontSize: 14,
      color: theme.text,
      fontWeight: '500',
      zIndex: 1,
    },
    pollVotes: {
      fontSize: 12,
      color: theme.textSecondary,
      zIndex: 1,
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.headerText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Engagement Hub</Text>
        </View>
        {isHR && (
          <TouchableOpacity onPress={() => navigation.navigate('CreateEngagement')}>
            <Ionicons name="add-circle-outline" size={28} color="#E91E63" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'Announcements' && styles.tabBtnActive]} onPress={() => setActiveTab('Announcements')}>
          <Text style={[styles.tabText, activeTab === 'Announcements' && styles.tabTextActive]}>Announcements</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'Polls' && styles.tabBtnActive]} onPress={() => setActiveTab('Polls')}>
          <Text style={[styles.tabText, activeTab === 'Polls' && styles.tabTextActive]}>Polls</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {activeTab === 'Announcements' && announcements.map(ann => (
          <View key={ann.id} style={[styles.card, { borderLeftColor: theme.primary }]}>
            <Text style={styles.announcementTitle}>{ann.title}</Text>
            <Text style={styles.announcementDate}><Ionicons name="calendar-outline" /> {ann.date}</Text>
            <Text style={styles.announcementContent}>{ann.content}</Text>
          </View>
        ))}

        {activeTab === 'Polls' && polls.map(poll => {
          const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
          
          return (
            <View key={poll.id} style={[styles.card, { borderLeftColor: '#E91E63' }]}>
              <Text style={styles.pollQuestion}>{poll.question}</Text>
              
              {poll.options.map(opt => {
                const percent = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                
                return (
                  <TouchableOpacity 
                    key={opt.id} 
                    style={[styles.pollOption, poll.voted && styles.pollOptionVoted]}
                    disabled={poll.voted}
                    onPress={() => votePoll(poll.id, opt.id)}
                  >
                    {poll.voted && <View style={[styles.pollFill, { width: `${percent}%` }]} />}
                    <Text style={styles.pollText}>{opt.text}</Text>
                    {poll.voted && <Text style={styles.pollVotes}>{percent}% ({opt.votes})</Text>}
                  </TouchableOpacity>
                )
              })}
              
              {poll.voted && (
                <Text style={{textAlign: 'center', marginTop: 8, fontSize: 12, color: theme.textSecondary}}>
                  Total Votes: {totalVotes}
                </Text>
              )}
            </View>
          );
        })}

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}
