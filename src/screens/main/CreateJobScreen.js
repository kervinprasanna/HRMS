import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useRecruitmentStore from '../../store/useRecruitmentStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function CreateJobScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const { addJob } = useRecruitmentStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    if (!title || !department || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    addJob({
      id: 'JOB-' + Math.floor(Math.random() * 1000),
      title,
      department,
      location,
      applicants: 0,
      status: 'Open'
    });
    
    Alert.alert('Success', 'Job opening published successfully!');
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      padding: SIZES.padding,
      paddingTop: Math.max(insets.top, SIZES.padding),
      backgroundColor: theme.headerBackground,
      
      
      marginBottom: SIZES.padding * 2,
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
    content: {
      paddingHorizontal: SIZES.padding,
    },
    label: {
      fontSize: SIZES.md,
      color: theme.text,
      marginBottom: 8,
      fontWeight: '600',
    },
    input: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      color: theme.text,
      fontSize: SIZES.md,
      marginBottom: SIZES.padding * 2,
    },
    submitBtn: {
      backgroundColor: theme.primary,
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
      alignItems: 'center',
    },
    cancelBtn: {
      padding: SIZES.padding,
      alignItems: 'center',
      marginTop: 8,
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.headerText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Job Opening</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.label}>Job Title</Text>
      <TextInput 
        style={styles.input}
        placeholder="e.g. Senior Developer"
        placeholderTextColor={theme.textSecondary}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Department</Text>
      <TextInput 
        style={styles.input}
        placeholder="e.g. Engineering"
        placeholderTextColor={theme.textSecondary}
        value={department}
        onChangeText={setDepartment}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput 
        style={styles.input}
        placeholder="e.g. Remote, New York"
        placeholderTextColor={theme.textSecondary}
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: SIZES.md }}>Publish Job</Text>
      </TouchableOpacity>
      
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={{ color: theme.textSecondary, fontSize: SIZES.md }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
