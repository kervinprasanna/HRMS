import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import useThemeStore from '../../store/useThemeStore';
import useRequestStore from '../../store/useRequestStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function RequestDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { request } = route.params;
  const { updateRequestStatus } = useRequestStore();
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [remark, setRemark] = useState(request.remark || '');

  const handleStatusChange = (newStatus) => {
    updateRequestStatus(request.id, newStatus, remark);
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.headerBackground,
      padding: SIZES.padding * 2,
      
      
    },
    backBtn: {
      marginBottom: SIZES.padding,
    },
    reqType: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    reqId: {
      fontSize: SIZES.md,
      color: theme.textSecondary,
      marginTop: 4,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'flex-start',
      marginTop: 12,
    },
    content: {
      padding: SIZES.padding,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
      marginTop: SIZES.padding,
    },
    infoCard: {
      backgroundColor: theme.surface,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      borderWidth: 1,
      borderColor: theme.border,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    infoLabel: {
      color: theme.textSecondary,
      fontSize: SIZES.md,
    },
    infoValue: {
      color: theme.text,
      fontSize: SIZES.md,
      fontWeight: '500',
    },
    descriptionBox: {
      backgroundColor: theme.surface,
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
      borderWidth: 1,
      borderColor: theme.border,
    },
    descText: {
      color: theme.text,
      fontSize: SIZES.md,
      lineHeight: 24,
    },
    input: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      color: theme.text,
      fontSize: SIZES.md,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: SIZES.padding * 2,
    },
    actionBtn: {
      flex: 1,
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
      alignItems: 'center',
      marginHorizontal: 4,
    },
    actionText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: SIZES.md,
    }
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return theme.success;
      case 'Rejected': return theme.danger;
      case 'Pending': return theme.warning;
      case 'In Progress': return theme.primary;
      default: return theme.textSecondary;
    }
  };

  const statusColor = getStatusColor(request.status);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{color: theme.primary, fontSize: 16}}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.reqType}>{request.type}</Text>
        <Text style={styles.reqId}>{request.id} • {request.date}</Text>
        
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: statusColor }}>{request.status}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Employee</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{request.employeeName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID</Text>
            <Text style={styles.infoValue}>{request.employeeId}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <View style={styles.descriptionBox}>
          <Text style={styles.descText}>{request.description}</Text>
        </View>

        <Text style={styles.sectionTitle}>HR Remarks</Text>
        <TextInput 
          style={styles.input}
          placeholder="Add comments or reasons..."
          placeholderTextColor={theme.textSecondary}
          multiline
          value={remark}
          onChangeText={setRemark}
        />

        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.actionBtn, {backgroundColor: theme.danger}]} 
            onPress={() => handleStatusChange('Rejected')}
          >
            <Text style={styles.actionText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, {backgroundColor: theme.warning}]} 
            onPress={() => handleStatusChange('In Progress')}
          >
            <Text style={styles.actionText}>In Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, {backgroundColor: theme.success}]} 
            onPress={() => handleStatusChange('Approved')}
          >
            <Text style={styles.actionText}>Approve</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{height: 40}} />
      </View>
    </ScrollView>
  );
}
