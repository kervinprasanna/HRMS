import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useAuthStore from '../../store/useAuthStore';
import useLMSStore from '../../store/useLMSStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function LMSDashboardScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  
  const empId = user?.id || 'EMP-2048';
  const { courses, enrollments, enrollCourse, updateCourseProgress } = useLMSStore();

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
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: SIZES.padding,
      marginTop: SIZES.padding,
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
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    courseTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
      marginRight: 8,
    },
    courseInfo: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 4,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    progressTrack: {
      height: 8,
      backgroundColor: theme.border,
      borderRadius: 4,
      overflow: 'hidden',
      marginTop: 12,
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: 4,
    },
    btnEnroll: {
      backgroundColor: theme.primary + '20',
      paddingVertical: 8,
      borderRadius: SIZES.radius,
      alignItems: 'center',
      marginTop: 12,
    },
    btnEnrollText: {
      color: theme.primary,
      fontWeight: 'bold',
    },
    btnContinue: {
      backgroundColor: theme.primary,
      paddingVertical: 8,
      borderRadius: SIZES.radius,
      alignItems: 'center',
      marginTop: 12,
    },
    btnContinueText: {
      color: '#FFF',
      fontWeight: 'bold',
    },
    certificateBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.success + '20',
      paddingVertical: 8,
      borderRadius: SIZES.radius,
      marginTop: 12,
      gap: 8,
    }
  });

  const renderCourse = (course) => {
    return (
      <View key={course.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <View style={[styles.badge, { backgroundColor: course.status === 'Completed' ? theme.success + '20' : course.status === 'In Progress' ? theme.primary + '20' : theme.border }]}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: course.status === 'Completed' ? theme.success : course.status === 'In Progress' ? theme.primary : theme.textSecondary }}>
              {course.status}
            </Text>
          </View>
        </View>
        
        <Text style={styles.courseInfo}><Ionicons name="time-outline" /> {course.duration}  •  <Ionicons name="book-outline" /> {course.modules} Modules</Text>
        
        {course.status !== 'Available' && (
          <View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${course.progress}%`, backgroundColor: course.status === 'Completed' ? theme.success : theme.primary }]} />
            </View>
            <Text style={{textAlign: 'right', marginTop: 4, fontSize: 12, color: theme.textSecondary}}>{course.progress}%</Text>
          </View>
        )}

        {course.status === 'Available' && (
          <TouchableOpacity style={styles.btnEnroll} onPress={() => enrollCourse(course.id, empId)}>
            <Text style={styles.btnEnrollText}>Enroll Now</Text>
          </TouchableOpacity>
        )}

        {course.status === 'In Progress' && (
          <TouchableOpacity style={styles.btnContinue} onPress={() => updateCourseProgress(course.id, empId, Math.min(course.progress + 20, 100))}>
            <Text style={styles.btnContinueText}>Continue Learning</Text>
          </TouchableOpacity>
        )}

        {course.status === 'Completed' && (
          <TouchableOpacity style={styles.certificateBtn}>
            <Ionicons name="ribbon-outline" size={16} color={theme.success} />
            <Text style={{color: theme.success, fontWeight: 'bold'}}>View Certificate</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const myCourses = courses.map(c => {
    const enrollment = enrollments.find(e => e.courseId === c.id && e.employeeId === empId);
    return {
      ...c,
      progress: enrollment ? enrollment.progress : 0,
      status: enrollment ? enrollment.status : 'Available'
    };
  });

  const inProgress = myCourses.filter(c => c.status === 'In Progress');
  const available = myCourses.filter(c => c.status === 'Available');
  const completed = myCourses.filter(c => c.status === 'Completed');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.headerText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learning Center</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {inProgress.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, {marginTop: 0}]}>In Progress</Text>
            {inProgress.map(renderCourse)}
          </>
        )}

        {available.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Available Courses</Text>
            {available.map(renderCourse)}
          </>
        )}

        {completed.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Completed</Text>
            {completed.map(renderCourse)}
          </>
        )}

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}
