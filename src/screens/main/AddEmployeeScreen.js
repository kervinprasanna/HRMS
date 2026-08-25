import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import useThemeStore from '../../store/useThemeStore';
import useEmployeeStore from '../../store/useEmployeeStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function AddEmployeeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const insets = useSafeAreaInsets();
  
  const { addEmployee, updateEmployee } = useEmployeeStore();
  
  // If editing, we pass an employee object in params
  const editMode = !!route.params?.employee;
  const employeeToEdit = route.params?.employee || {};

  const [isPhotoSheetVisible, setPhotoSheetVisible] = useState(false);
  
  const [formData, setFormData] = useState({
    name: employeeToEdit.name || '',
    email: employeeToEdit.email || '',
    dept: employeeToEdit.dept || '',
    role: employeeToEdit.role || '',
    location: employeeToEdit.location || '',
    manager: employeeToEdit.manager || '',
    joiningDate: employeeToEdit.joiningDate || '',
    type: employeeToEdit.type || '',
    maritalStatus: employeeToEdit.maritalStatus || '',
    address: employeeToEdit.address || '',
    photo: employeeToEdit.photo || null,
  });

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.dept || !formData.role) {
      Alert.alert('Error', 'Please fill in Name, Email, Department, and Role.');
      return;
    }
    
    if (editMode) {
      updateEmployee(employeeToEdit.id, formData);
      Alert.alert('Success', 'Employee updated successfully!');
      navigation.goBack();
    } else {
      addEmployee(formData);
      Alert.alert('Success', 'Employee added successfully!');
      navigation.goBack();
    }
  };

  const handleChangePhoto = () => {
    setPhotoSheetVisible(true);
  };

  const handleTakePhoto = async () => {
    setPhotoSheetVisible(false);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera is required!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) handleChange('photo', result.assets[0].uri);
  };

  const handleChooseFromLibrary = async () => {
    setPhotoSheetVisible(false);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access gallery is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) handleChange('photo', result.assets[0].uri);
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
    inputGroup: {
      marginBottom: SIZES.padding,
    },
    label: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 8,
      fontWeight: '500',
    },
    input: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      color: theme.text,
      fontSize: SIZES.md,
    },
    saveBtn: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: SIZES.radius,
      alignItems: 'center',
      marginTop: SIZES.padding,
      marginBottom: SIZES.padding * 4,
    },
    saveBtnText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    photoContainer: {
      alignItems: 'center',
      marginVertical: SIZES.padding * 1.5,
    },
    photoPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.primary,
    },
    photoBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: theme.primary,
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.surface,
    },
    // Bottom Sheet Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    sheetContainer: {
      backgroundColor: theme.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: SIZES.padding * 2,
      paddingBottom: Math.max(insets.bottom + SIZES.padding, SIZES.padding * 2),
    },
    sheetTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: SIZES.padding * 2,
      textAlign: 'center',
    },
    sheetBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    sheetBtnText: {
      fontSize: 16,
      color: theme.text,
      marginLeft: 16,
      fontWeight: '500',
    },
    sheetCancelBtn: {
      marginTop: SIZES.padding * 2,
      backgroundColor: theme.background,
      padding: 16,
      borderRadius: SIZES.radius,
      alignItems: 'center',
    },
    sheetCancelText: {
      color: theme.danger,
      fontSize: 16,
      fontWeight: 'bold',
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.headerText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{editMode ? 'Edit Employee' : 'Add Employee'}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.photoContainer}>
          <TouchableOpacity style={styles.photoPlaceholder} onPress={handleChangePhoto}>
            {formData.photo ? (
              <Image 
                source={{ uri: formData.photo }} 
                style={{ width: 100, height: 100, borderRadius: 50 }} 
              />
            ) : (
              <Text style={{fontSize: 40, color: theme.primary, fontWeight: 'bold'}}>
                {formData.name ? formData.name.charAt(0) : '?'}
              </Text>
            )}
            <View style={styles.photoBadge}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.label, {marginTop: 12, textAlign: 'center'}]}>Tap to change photo</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={formData.name} onChangeText={(v) => handleChange('name', v)} placeholder="John Doe" placeholderTextColor={theme.textSecondary} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput style={styles.input} value={formData.email} onChangeText={(v) => handleChange('email', v)} placeholder="john@example.com" keyboardType="email-address" placeholderTextColor={theme.textSecondary} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Department</Text>
          <TextInput style={styles.input} value={formData.dept} onChangeText={(v) => handleChange('dept', v)} placeholder="Engineering" placeholderTextColor={theme.textSecondary} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Designation / Role</Text>
          <TextInput style={styles.input} value={formData.role} onChangeText={(v) => handleChange('role', v)} placeholder="Software Engineer" placeholderTextColor={theme.textSecondary} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Work Location</Text>
          <TextInput style={styles.input} value={formData.location} onChangeText={(v) => handleChange('location', v)} placeholder="Bhubaneswar" placeholderTextColor={theme.textSecondary} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reporting Manager</Text>
          <TextInput style={styles.input} value={formData.manager} onChangeText={(v) => handleChange('manager', v)} placeholder="Manager Name" placeholderTextColor={theme.textSecondary} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Joining Date</Text>
          <TextInput style={styles.input} value={formData.joiningDate} onChangeText={(v) => handleChange('joiningDate', v)} placeholder="DD-MM-YYYY" placeholderTextColor={theme.textSecondary} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Employment Type</Text>
          <TextInput style={styles.input} value={formData.type} onChangeText={(v) => handleChange('type', v)} placeholder="Permanent, Contract, etc." placeholderTextColor={theme.textSecondary} />
        </View>

        <TouchableOpacity style={[styles.saveBtn, { marginBottom: SIZES.padding * 4 }]} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Employee</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Action Sheet for Photo */}
      <Modal
        visible={isPhotoSheetVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPhotoSheetVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPhotoSheetVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.sheetContainer}>
          <Text style={styles.sheetTitle}>Profile Photo</Text>
          
          <TouchableOpacity style={styles.sheetBtn} onPress={handleTakePhoto}>
            <Ionicons name="camera-outline" size={24} color={theme.text} />
            <Text style={styles.sheetBtnText}>Take a Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.sheetBtn, {borderBottomWidth: 0}]} onPress={handleChooseFromLibrary}>
            <Ionicons name="images-outline" size={24} color={theme.text} />
            <Text style={styles.sheetBtnText}>Choose from Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sheetCancelBtn} onPress={() => setPhotoSheetVisible(false)}>
            <Text style={styles.sheetCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
