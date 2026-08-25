import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import useThemeStore from '../../store/useThemeStore';
import usePayrollStore from '../../store/usePayrollStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function CreatePayslipScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { employee } = route.params;
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const insets = useSafeAreaInsets();
  
  const { addPayslip } = usePayrollStore();
  
  const [formData, setFormData] = useState({
    month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    basic: '',
    hra: '',
    allowance: '',
    tax: '',
    pf: '',
    otherDeduction: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateObj, setDateObj] = useState(new Date());

  const handleChange = (key, value) => {
    // Only allow numbers for monetary fields
    if (key !== 'month' && value !== '' && isNaN(Number(value))) return;
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const calculateNet = () => {
    const earnings = Number(formData.basic || 0) + Number(formData.hra || 0) + Number(formData.allowance || 0);
    const deductions = Number(formData.tax || 0) + Number(formData.pf || 0) + Number(formData.otherDeduction || 0);
    return earnings - deductions;
  };

  const handleSave = () => {
    if (!formData.month || !formData.basic) {
      Alert.alert('Error', 'Please fill in at least the Month and Basic Salary.');
      return;
    }
    
    const net = calculateNet();
    
    const payslip = {
      employeeId: employee.id,
      month: formData.month,
      earnings: {
        basic: Number(formData.basic || 0),
        hra: Number(formData.hra || 0),
        allowance: Number(formData.allowance || 0)
      },
      deductions: {
        tax: Number(formData.tax || 0),
        pf: Number(formData.pf || 0),
        other: Number(formData.otherDeduction || 0)
      },
      net: `₹${net.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
    };

    addPayslip(payslip);
    Alert.alert('Success', `Payslip generated successfully for ${employee.name}!`);
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
      marginTop: SIZES.padding,
      marginBottom: SIZES.padding,
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
    summaryCard: {
      backgroundColor: theme.primary + '15',
      padding: SIZES.padding * 1.5,
      borderRadius: SIZES.radius,
      marginTop: SIZES.padding,
      borderWidth: 1,
      borderColor: theme.primary + '50',
      alignItems: 'center',
    },
    saveBtn: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: SIZES.radius,
      alignItems: 'center',
      marginTop: SIZES.padding * 2,
      marginBottom: SIZES.padding * 4,
    },
    saveBtnText: {
      color: '#FFFFFF',
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
        <Text style={styles.headerTitle}>Generate Payslip</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Month & Year</Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{color: formData.month ? theme.text : theme.textSecondary}}>
              {formData.month || 'Select Month'}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dateObj}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDateObj(selectedDate);
                handleChange('month', selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
              }
            }}
          />
        )}

        <Text style={styles.sectionTitle}>Earnings</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Basic Salary (₹)</Text>
          <TextInput style={styles.input} value={formData.basic} onChangeText={(v) => handleChange('basic', v)} placeholder="0.00" keyboardType="numeric" placeholderTextColor={theme.textSecondary} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>House Rent Allowance (HRA) (₹)</Text>
          <TextInput style={styles.input} value={formData.hra} onChangeText={(v) => handleChange('hra', v)} placeholder="0.00" keyboardType="numeric" placeholderTextColor={theme.textSecondary} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Other Allowances (₹)</Text>
          <TextInput style={styles.input} value={formData.allowance} onChangeText={(v) => handleChange('allowance', v)} placeholder="0.00" keyboardType="numeric" placeholderTextColor={theme.textSecondary} />
        </View>

        <Text style={styles.sectionTitle}>Deductions</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tax Deducted at Source (TDS) (₹)</Text>
          <TextInput style={styles.input} value={formData.tax} onChangeText={(v) => handleChange('tax', v)} placeholder="0.00" keyboardType="numeric" placeholderTextColor={theme.textSecondary} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Provident Fund (PF) (₹)</Text>
          <TextInput style={styles.input} value={formData.pf} onChangeText={(v) => handleChange('pf', v)} placeholder="0.00" keyboardType="numeric" placeholderTextColor={theme.textSecondary} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Other Deductions (₹)</Text>
          <TextInput style={styles.input} value={formData.otherDeduction} onChangeText={(v) => handleChange('otherDeduction', v)} placeholder="0.00" keyboardType="numeric" placeholderTextColor={theme.textSecondary} />
        </View>

        <View style={styles.summaryCard}>
          <Text style={{color: theme.textSecondary, fontSize: 14, marginBottom: 4}}>Calculated Net Salary</Text>
          <Text style={{color: theme.primary, fontSize: 32, fontWeight: 'bold'}}>₹{calculateNet().toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Generate Payslip</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
