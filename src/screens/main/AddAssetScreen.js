import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useAssetStore from '../../store/useAssetStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function AddAssetScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const { addAsset } = useAssetStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [name, setName] = useState('');
  const [type, setType] = useState('Laptop');

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an asset name');
      return;
    }
    
    addAsset({
      id: 'AST-' + Math.floor(Math.random() * 1000),
      name,
      type,
      assignedTo: null,
      assignedName: null,
      status: 'Available',
      history: [{ date: new Date().toISOString().split('T')[0], action: 'Added to inventory' }]
    });
    
    Alert.alert('Success', 'Asset added to inventory successfully!');
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
    typeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: SIZES.padding * 2,
    },
    typeBtn: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: SIZES.radius,
      borderWidth: 1,
      borderColor: theme.border,
      marginRight: 10,
      marginBottom: 10,
    },
    typeBtnActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
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

  const TYPES = ['Laptop', 'Mobile', 'ID Card', 'Accessories', 'Other'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.headerText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Asset</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.label}>Asset Name / Model</Text>
      <TextInput 
        style={styles.input}
        placeholder="e.g. MacBook Air M2"
        placeholderTextColor={theme.textSecondary}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Asset Type</Text>
      <View style={styles.typeContainer}>
        {TYPES.map(t => (
          <TouchableOpacity 
            key={t}
            style={[styles.typeBtn, type === t && styles.typeBtnActive]} 
            onPress={() => setType(t)}
          >
            <Text style={{ color: type === t ? '#FFF' : theme.text }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: SIZES.md }}>Add Asset</Text>
      </TouchableOpacity>
      
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={{ color: theme.textSecondary, fontSize: SIZES.md }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
