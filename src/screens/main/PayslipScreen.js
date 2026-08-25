import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import useThemeStore from '../../store/useThemeStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function PayslipScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { payslip, employeeName } = route.params;
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const insets = useSafeAreaInsets();

  const generatePDF = async () => {
    try {
      const basic = (payslip.earnings?.basic || 0).toLocaleString('en-IN', {minimumFractionDigits: 2});
      const hra = (payslip.earnings?.hra || 0).toLocaleString('en-IN', {minimumFractionDigits: 2});
      const allowance = (payslip.earnings?.allowance || 0).toLocaleString('en-IN', {minimumFractionDigits: 2});
      
      const tax = (payslip.deductions?.tax || 0).toLocaleString('en-IN', {minimumFractionDigits: 2});
      const pf = (payslip.deductions?.pf || 0).toLocaleString('en-IN', {minimumFractionDigits: 2});
      const other = (payslip.deductions?.other || 0).toLocaleString('en-IN', {minimumFractionDigits: 2});
      
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                padding: 40px; 
                color: #2D3748; 
                background-color: #F7FAFC;
              }
              .payslip-container {
                background: #FFFFFF;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                border: 1px solid #E2E8F0;
              }
              .header { 
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #EDF2F7; 
                padding-bottom: 24px; 
                margin-bottom: 32px; 
              }
              .company-name {
                font-size: 28px;
                font-weight: 800;
                color: #2B6CB0;
                margin: 0;
                letter-spacing: -0.5px;
              }
              .payslip-title {
                text-align: right;
              }
              .payslip-title h2 {
                margin: 0;
                color: #4A5568;
                font-size: 20px;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              .payslip-title p {
                margin: 4px 0 0 0;
                color: #718096;
                font-weight: 500;
              }
              .emp-details { 
                display: flex;
                justify-content: space-between;
                background: #F7FAFC;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 32px;
                border: 1px solid #EDF2F7;
              }
              .emp-column p {
                margin: 8px 0;
                font-size: 14px;
              }
              .emp-column strong {
                display: inline-block;
                width: 120px;
                color: #4A5568;
              }
              .details-value {
                font-weight: 600;
                color: #2D3748;
              }
              .financial-section {
                display: flex;
                gap: 24px;
                margin-bottom: 32px;
              }
              .financial-table { 
                flex: 1;
                border-collapse: collapse; 
              }
              .financial-table th { 
                background-color: #EDF2F7; 
                color: #4A5568;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                padding: 12px 16px; 
                text-align: left; 
                border-bottom: 2px solid #CBD5E0;
              }
              .financial-table td { 
                padding: 12px 16px; 
                border-bottom: 1px solid #EDF2F7; 
                font-size: 14px;
              }
              .financial-table td.amount { 
                text-align: right; 
                font-family: monospace;
                font-size: 15px;
              }
              .financial-table .total-row td {
                background: #F7FAFC;
                font-weight: 700;
                color: #2D3748;
                border-bottom: 2px solid #CBD5E0;
                border-top: 2px solid #CBD5E0;
              }
              .net-pay-container {
                display: flex;
                justify-content: flex-end;
                margin-top: 20px;
              }
              .net-pay { 
                background: #F0FFF4;
                border: 1px solid #9AE6B4;
                padding: 24px 40px; 
                border-radius: 8px; 
                text-align: right;
              }
              .net-pay-title {
                color: #38A169;
                font-size: 14px;
                text-transform: uppercase;
                font-weight: 700;
                letter-spacing: 1px;
                margin-bottom: 8px;
              }
              .net-pay-amount {
                color: #22543D;
                font-size: 32px;
                font-weight: 800;
                margin: 0;
              }
              .footer {
                margin-top: 60px;
                text-align: center;
                color: #A0AEC0;
                font-size: 12px;
                border-top: 1px solid #EDF2F7;
                padding-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="payslip-container">
              <div class="header">
                <h1 class="company-name">HRMS Corp</h1>
                <div class="payslip-title">
                  <h2>Payslip</h2>
                  <p>${payslip.month}</p>
                </div>
              </div>
              
              <div class="emp-details">
                <div class="emp-column">
                  <p><strong>Employee Name:</strong> <span class="details-value">${employeeName}</span></p>
                  <p><strong>Employee ID:</strong> <span class="details-value">${payslip.employeeId || 'EMP-2048'}</span></p>
                </div>
                <div class="emp-column">
                  <p><strong>Payslip ID:</strong> <span class="details-value">${payslip.id}</span></p>
                  <p><strong>Date Generated:</strong> <span class="details-value">${payslip.date}</span></p>
                </div>
              </div>

              <div class="financial-section">
                <!-- Earnings Column -->
                <table class="financial-table">
                  <tr>
                    <th>Earnings</th>
                    <th style="text-align: right">Amount</th>
                  </tr>
                  <tr><td>Basic Salary</td><td class="amount">₹${basic}</td></tr>
                  <tr><td>House Rent Allowance</td><td class="amount">₹${hra}</td></tr>
                  <tr><td>Special Allowances</td><td class="amount">₹${allowance}</td></tr>
                  <tr class="total-row">
                    <td>Total Earnings</td>
                    <td class="amount">₹${((payslip.earnings?.basic || 0) + (payslip.earnings?.hra || 0) + (payslip.earnings?.allowance || 0)).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                  </tr>
                </table>

                <!-- Deductions Column -->
                <table class="financial-table">
                  <tr>
                    <th>Deductions</th>
                    <th style="text-align: right">Amount</th>
                  </tr>
                  <tr><td>Income Tax (TDS)</td><td class="amount">₹${tax}</td></tr>
                  <tr><td>Provident Fund (PF)</td><td class="amount">₹${pf}</td></tr>
                  ${payslip.deductions?.other ? `<tr><td>Other Deductions</td><td class="amount">₹${other}</td></tr>` : '<tr><td>&nbsp;</td><td>&nbsp;</td></tr>'}
                  <tr class="total-row">
                    <td>Total Deductions</td>
                    <td class="amount">₹${((payslip.deductions?.tax || 0) + (payslip.deductions?.pf || 0) + (payslip.deductions?.other || 0)).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                  </tr>
                </table>
              </div>

              <div class="net-pay-container">
                <div class="net-pay">
                  <div class="net-pay-title">Net Salary Transfer</div>
                  <h3 class="net-pay-amount">${payslip.net}</h3>
                </div>
              </div>
              
              <div class="footer">
                <p>This is a computer-generated document. No signature is required.</p>
              </div>
            </div>
          </body>
        </html>
      `;
      
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      
    } catch (error) {
      Alert.alert('Error', 'Could not generate PDF');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      padding: SIZES.padding,
      paddingTop: Math.max(insets.top, SIZES.padding),
      backgroundColor: theme.primary,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFF',
      marginLeft: 16,
    },
    headerSubtitle: {
      fontSize: 16,
      color: 'rgba(255,255,255,0.8)',
      marginLeft: 40,
      marginTop: 4,
    },
    content: {
      padding: SIZES.padding,
      marginTop: 8,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: SIZES.padding,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textSecondary,
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.background,
    },
    label: {
      fontSize: SIZES.md,
      color: theme.text,
    },
    value: {
      fontSize: SIZES.md,
      fontWeight: '500',
      color: theme.text,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      marginTop: 8,
      borderTopWidth: 2,
      borderTopColor: theme.border,
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    totalValue: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.primary,
    },
    downloadBtn: {
      backgroundColor: theme.primary,
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
      alignItems: 'center',
      marginTop: SIZES.padding,
    }
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.headerText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payslip</Text>
        </View>
        <Text style={styles.headerSubtitle}>{payslip.month} • {employeeName}</Text>
      </View>

      <View style={styles.content}>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Earnings</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Basic Salary</Text>
            <Text style={styles.value}>₹{(payslip.earnings?.basic || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>House Rent Allowance (HRA)</Text>
            <Text style={styles.value}>₹{(payslip.earnings?.hra || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</Text>
          </View>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.label}>Special Allowances</Text>
            <Text style={styles.value}>₹{(payslip.earnings?.allowance || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Deductions</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Income Tax (TDS)</Text>
            <Text style={[styles.value, {color: theme.danger}]}>-₹{(payslip.deductions?.tax || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</Text>
          </View>
          <View style={payslip.deductions?.other ? styles.row : [styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.label}>Provident Fund (PF)</Text>
            <Text style={[styles.value, {color: theme.danger}]}>-₹{(payslip.deductions?.pf || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</Text>
          </View>
          {!!payslip.deductions?.other && (
            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <Text style={styles.label}>Other Deductions</Text>
              <Text style={[styles.value, {color: theme.danger}]}>-₹{payslip.deductions.other.toLocaleString('en-IN', {minimumFractionDigits: 2})}</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Net Salary</Text>
            <Text style={styles.totalValue}>{payslip.net}</Text>
          </View>
          <Text style={{color: theme.textSecondary, fontSize: 12, marginTop: 4, textAlign: 'right'}}>
            Amount in words: Five Thousand Two Hundred Forty Rupees Only
          </Text>
        </View>

        <TouchableOpacity style={styles.downloadBtn} onPress={generatePDF}>
          <Text style={{color: '#FFF', fontWeight: 'bold', fontSize: 16}}>Download PDF</Text>
        </TouchableOpacity>
        
        <View style={{height: 40}} />
      </View>
    </ScrollView>
  );
}
