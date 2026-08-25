import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useAuthStore from '../../store/useAuthStore';
import useDocumentStore from '../../store/useDocumentStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function UploadDocumentScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const { addDocument } = useDocumentStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('ID Proof');
  const [fileSelected, setFileSelected] = useState(false);

  const docTypes = ['ID Proof', 'Certificate', 'Qualification', 'Employment', 'Other'];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      padding: SIZES.padding,
      paddingTop: Math.max(insets.top, SIZES.padding),
      backgroundColor: theme.headerBackground,
      
      
      marginBottom: SIZES.padding,
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
    typeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    typeBtn: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },
    typeBtnActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    typeBtnText: {
      color: theme.text,
    },
    typeBtnTextActive: {
      color: '#FFF',
      fontWeight: 'bold',
    },
    uploadArea: {
      borderWidth: 2,
      borderColor: theme.border,
      borderStyle: 'dashed',
      borderRadius: SIZES.radius,
      padding: 32,
      alignItems: 'center',
      marginTop: 16,
      backgroundColor: theme.surface,
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

  const handleSelectFile = () => {
    // Mocking a local file picker interaction
    Alert.alert('Document Picker', 'Native file picker opened.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Select dummy.pdf', onPress: () => setFileSelected(true) }
    ]);
  };

  const handleUpload = () => {
    if (!docName.trim()) {
      Alert.alert('Error', 'Please enter a document name');
      return;
    }
    if (!fileSelected) {
      Alert.alert('Error', 'Please select a file to upload');
      return;
    }

    addDocument({
      employeeId: user?.id || 'EMP-2048',
      employeeName: user?.name || 'John Doe',
      name: docName,
      type: docType,
      fileUri: 'file:///mock/path/dummy.pdf'
    });

    Alert.alert('Success', 'Document uploaded successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.headerText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upload Document</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Document Name</Text>
        <TextInput 
          style={styles.input}
          placeholder="e.g. 10th Marksheet"
          placeholderTextColor={theme.textSecondary}
          value={docName}
          onChangeText={setDocName}
        />

        <Text style={styles.label}>Document Type</Text>
        <View style={styles.typeContainer}>
          {docTypes.map(type => (
            <TouchableOpacity 
              key={type}
              style={[styles.typeBtn, docType === type && styles.typeBtnActive]}
              onPress={() => setDocType(type)}
            >
              <Text style={[styles.typeBtnText, docType === type && styles.typeBtnTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Upload File</Text>
        <TouchableOpacity style={[styles.uploadArea, fileSelected && {borderColor: theme.success}]} onPress={handleSelectFile}>
          <Ionicons 
            name={fileSelected ? "checkmark-circle" : "cloud-upload-outline"} 
            size={48} 
            color={fileSelected ? theme.success : theme.primary} 
          />
          <Text style={{color: theme.text, marginTop: 12, fontWeight: '600'}}>
            {fileSelected ? 'dummy.pdf selected' : 'Tap to Browse Files'}
          </Text>
          {!fileSelected && (
            <Text style={{color: theme.textSecondary, fontSize: 12, marginTop: 4}}>
              Supported formats: PDF, JPG, PNG
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={handleUpload}>
          <Text style={styles.submitBtnText}>Submit Document</Text>
        </TouchableOpacity>
        
        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}
