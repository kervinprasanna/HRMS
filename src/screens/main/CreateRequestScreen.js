import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import BottomSheet from '../../components/BottomSheet';
import useAuthStore from '../../store/useAuthStore';
import useThemeStore from '../../store/useThemeStore';
import useRequestStore from '../../store/useRequestStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function CreateRequestScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const { addRequest } = useRequestStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [type, setType] = useState('');
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [description, setDescription] = useState('');
  
  const LEAVE_TYPES = [
    { label: 'Sick Leave', balance: 5 },
    { label: 'Casual Leave', balance: 3 },
    { label: 'Earned Leave', balance: 12 },
    { label: 'Maternity Leave', balance: 90 },
  ];
  
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  
  const [attachment, setAttachment] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAttachment({
          uri: result.assets[0].uri,
          name: result.assets[0].name,
        });
      }
    } catch (err) {
      console.log('Error picking document:', err);
    }
  };

  const handleSubmit = () => {
    if (!type) {
      Alert.alert('Error', 'Please select a leave type');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a reason for the leave');
      return;
    }
    
    addRequest({
      id: 'REQ-' + Math.floor(Math.random() * 1000),
      employeeId: user?.id || 'EMP-000',
      employeeName: user?.name,
      type,
      description,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: toDate.toISOString().split('T')[0],
      attachmentUri: attachment?.uri || null,
      attachmentName: attachment?.name || null,
    });
    
    Alert.alert('Success', 'Leave applied successfully!');
    navigation.goBack();
  };

  const handleFromDateChange = (event, selectedDate) => {
    setShowFromPicker(Platform.OS === 'ios');
    if (selectedDate) setFromDate(selectedDate);
  };

  const handleToDateChange = (event, selectedDate) => {
    setShowToPicker(Platform.OS === 'ios');
    if (selectedDate) setToDate(selectedDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const mintGreen = isDarkMode ? '#2D8C61' : '#7FE7B4';
  const cardBg = isDarkMode ? theme.surface : '#FFFFFF';
  const darkBlue = '#224775';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cardBg,
    },
    topBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 250,
      backgroundColor: mintGreen,
    },
    header: {
      paddingHorizontal: SIZES.padding,
      paddingTop: Math.max(insets.top, SIZES.padding),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 30,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.headerText,
    },
    headerAction: {
      alignItems: 'center',
    },
    card: {
      backgroundColor: cardBg,
      marginHorizontal: SIZES.padding,
      borderRadius: 16,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      padding: SIZES.padding,
      borderWidth: isDarkMode ? 1 : 0,
      borderColor: theme.border,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? theme.border : '#F0F0F0',
    },
    iconBox: {
      width: 48,
      height: 48,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? theme.border : '#E0E0E0',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    rowContent: {
      flex: 1,
      justifyContent: 'center',
    },
    label: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: '600',
      marginBottom: 4,
    },
    value: {
      fontSize: 15,
      fontWeight: 'bold',
      color: theme.text,
    },
    input: {
      fontSize: 15,
      fontWeight: 'bold',
      color: theme.text,
      padding: 0,
    },
    changeText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.textSecondary,
      textDecorationLine: 'underline',
    },
    attachmentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 20,
    },
    submitBtn: {
      backgroundColor: darkBlue,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    submitBtnText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: cardBg,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: SIZES.padding,
      paddingBottom: 40,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    typeOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    typeOptionText: {
      fontSize: 16,
      color: theme.text,
      fontWeight: '600',
    },
    typeOptionBalance: {
      fontSize: 14,
      color: theme.textSecondary,
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}>
          <Ionicons name="arrow-back" size={24} color={theme.headerText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply Leave</Text>
        <TouchableOpacity style={styles.headerAction} onPress={() => navigation.navigate('MainTabs', { screen: 'Requests' })}>
          <Ionicons name="list-outline" size={24} color={theme.headerText} />
          <Text style={{fontSize: 10, fontWeight: 'bold', color: theme.headerText}}>Leave List</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          
          {/* Leave Type */}
          <TouchableOpacity style={styles.row} onPress={() => setShowTypePicker(true)}>
            <View style={styles.iconBox}>
              <Ionicons name="calendar" size={20} color={theme.text} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.label}>Leave Type</Text>
              <Text style={[styles.input, { color: type ? theme.text : theme.textSecondary, marginTop: 4 }]}>
                {type || "Select Leave Type"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Reason */}
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Ionicons name="chatbox-ellipses" size={20} color={theme.text} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.label}>Reason</Text>
              <TextInput 
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter Leave Reason"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </View>

          {/* From Date */}
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Ionicons name="calendar-outline" size={20} color={theme.text} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.label}>From</Text>
              <Text style={styles.value}>{formatDate(fromDate)}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowFromPicker(true)}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* To Date */}
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Ionicons name="calendar-outline" size={20} color={theme.text} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.label}>To</Text>
              <Text style={styles.value}>{formatDate(toDate)}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowToPicker(true)}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Attachment */}
          <TouchableOpacity style={styles.attachmentRow} onPress={pickDocument}>
            <Ionicons name="attach" size={20} color={theme.text} style={{marginRight: 8}} />
            <Text 
              style={{fontSize: 14, fontStyle: 'italic', color: attachment ? theme.primary : theme.textSecondary, fontWeight: '600', flex: 1}}
              numberOfLines={1}
            >
              {attachment ? attachment.name : 'Add Document / Image'}
            </Text>
            {attachment && <Ionicons name="checkmark-circle" size={20} color={theme.success || '#4CAF50'} />}
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Apply Leave</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {showFromPicker && (
        <DateTimePicker
          value={fromDate}
          mode="date"
          display="default"
          onChange={handleFromDateChange}
        />
      )}
      
      {showToPicker && (
        <DateTimePicker
          value={toDate}
          mode="date"
          display="default"
          onChange={handleToDateChange}
        />
      )}

      {/* Leave Type Bottom Sheet */}
      <BottomSheet visible={showTypePicker} onClose={() => setShowTypePicker(false)} snapHeight={320}>
        <Text style={[styles.modalTitle, { color: theme.text, marginBottom: SIZES.padding * 1.5 }]}>Select Leave Type</Text>
        {LEAVE_TYPES.map((lt, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.typeOption, { borderColor: theme.border }]}
            onPress={() => {
              setType(lt.label);
              setShowTypePicker(false);
            }}
          >
            <Text style={[styles.typeOptionText, { color: theme.text }]}>{lt.label}</Text>
            <Text style={styles.typeOptionBalance}>Balance: {lt.balance}</Text>
          </TouchableOpacity>
        ))}
      </BottomSheet>
    </View>
  );
}
