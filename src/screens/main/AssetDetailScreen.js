import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, FlatList, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useAssetStore from '../../store/useAssetStore';
import useEmployeeStore from '../../store/useEmployeeStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function AssetDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { asset } = route.params;
  const { updateAssetStatus } = useAssetStore();
  const { employees } = useEmployeeStore();
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const insets = useSafeAreaInsets();
  
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.headerBackground,
      padding: SIZES.padding,
      paddingTop: Math.max(insets.top, SIZES.padding),
      
      
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
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginTop: 12,
      marginLeft: 40,
    },
    idText: {
      fontSize: SIZES.md,
      color: theme.textSecondary,
      marginTop: 4,
      marginLeft: 40,
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
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: SIZES.padding,
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
    },
    historyItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: SIZES.padding,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SIZES.padding,
    },
    searchInput: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 12,
      borderRadius: SIZES.radius,
      color: theme.text,
      marginBottom: SIZES.padding,
    },
    empCard: {
      backgroundColor: theme.surface,
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.border,
    }
  });

  const handleAssign = () => {
    setShowAssignModal(true);
  };

  const confirmAssign = (employee) => {
    updateAssetStatus(asset.id, 'Assigned', employee.id, employee.name, `Assigned to ${employee.name}`);
    setShowAssignModal(false);
    navigation.goBack();
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReturn = () => {
    updateAssetStatus(asset.id, 'Available', null, null, `Returned by ${asset.assignedName}`);
    navigation.goBack();
  };

  const handleMaintenance = () => {
    updateAssetStatus(asset.id, 'Maintenance', asset.assignedTo, asset.assignedName, 'Sent to maintenance');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.headerText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Asset Details</Text>
        </View>
        
        <Text style={styles.name}>{asset.name}</Text>
        <Text style={styles.idText}>{asset.id} • {asset.type}</Text>
      </View>

      <View style={styles.content}>
        
        <Text style={styles.sectionTitle}>Current Status</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[styles.infoValue, { color: asset.status === 'Available' ? theme.success : theme.primary }]}>
              {asset.status}
            </Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Assigned To</Text>
            <Text style={styles.infoValue}>{asset.assignedName || 'Unassigned'}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Manage Asset</Text>
        <View style={styles.actionRow}>
          {asset.status === 'Available' && (
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.primary}]} onPress={handleAssign}>
              <Text style={styles.actionText}>Assign</Text>
            </TouchableOpacity>
          )}
          
          {asset.status === 'Assigned' && (
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.success}]} onPress={handleReturn}>
              <Text style={styles.actionText}>Return</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.warning}]} onPress={handleMaintenance}>
            <Text style={styles.actionText}>Maintenance</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Asset History</Text>
        <View style={styles.infoCard}>
          {asset.history.map((h, i) => (
            <View key={i} style={[styles.historyItem, i === asset.history.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={{color: theme.text, flex: 1}}>{h.action}</Text>
              <Text style={{color: theme.textSecondary, fontSize: 12}}>{h.date}</Text>
            </View>
          ))}
        </View>
        
        <View style={{height: 40}} />
      </View>

      <Modal visible={showAssignModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={{fontSize: 20, fontWeight: 'bold', color: theme.text}}>Assign Asset</Text>
              <TouchableOpacity onPress={() => setShowAssignModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            <TextInput 
              style={styles.searchInput}
              placeholder="Search employee..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList 
              data={filteredEmployees}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.empCard} onPress={() => confirmAssign(item)}>
                  <Text style={{color: theme.text, fontWeight: 'bold', fontSize: 16}}>{item.name}</Text>
                  <Text style={{color: theme.textSecondary, fontSize: 14}}>{item.id} • {item.dept}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={{color: theme.textSecondary, textAlign: 'center', padding: 20}}>No employees found.</Text>}
            />
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}
