import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/useThemeStore';
import useAuthStore from '../../store/useAuthStore';
import useDocumentStore from '../../store/useDocumentStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function CredentialsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  
  const { user } = useAuthStore();
  const isHR = user?.role === 'HR';
  const { documents, updateDocumentStatus, deleteDocument } = useDocumentStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Filter docs: HR sees all (with search), Employee sees only theirs
  let displayDocs = documents;
  if (!isHR) {
    displayDocs = documents.filter(doc => doc.employeeId === user?.id);
  }
  
  if (searchQuery) {
    displayDocs = displayDocs.filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

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
      justifyContent: 'space-between',
      alignItems: 'center',
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
    searchContainer: {
      padding: SIZES.padding,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    searchInput: {
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 12,
      borderRadius: SIZES.radius,
      color: theme.text,
      fontSize: SIZES.md,
    },
    list: {
      padding: SIZES.padding,
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
      marginBottom: 8,
    },
    docName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
      marginRight: 8,
    },
    docType: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: '600',
    },
    detailText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: 'bold',
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
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SIZES.padding,
    },
    actionBtn: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    actionText: {
      fontSize: 16,
      color: theme.text,
      textAlign: 'center',
      fontWeight: '600',
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return theme.success;
      case 'Rejected': return theme.danger;
      default: return theme.warning;
    }
  };

  const handleDocPress = (doc) => {
    if (isHR) {
      setSelectedDoc(doc);
      setShowStatusModal(true);
    } else {
      Alert.alert('Document Detail', `Viewing ${doc.name}\n\nType: ${doc.type}\nStatus: ${doc.status}`);
    }
  };

  const changeStatus = (status) => {
    updateDocumentStatus(selectedDoc.id, status);
    setShowStatusModal(false);
  };

  const removeDoc = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this document?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        deleteDocument(selectedDoc.id);
        setShowStatusModal(false);
      }}
    ]);
  };

  const renderItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    return (
      <TouchableOpacity style={styles.card} onPress={() => handleDocPress(item)}>
        <View style={styles.cardHeader}>
          <Text style={styles.docName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.docType}>{item.type}</Text>
        </View>
        
        {isHR && (
          <Text style={styles.detailText}>Employee: {item.employeeName} ({item.employeeId})</Text>
        )}
        <Text style={styles.detailText}>Uploaded: {item.uploadDate}</Text>
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{item.status}</Text>
          </View>
          <Ionicons name="document-text-outline" size={20} color={theme.textSecondary} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.headerText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Credentials</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('UploadDocument')}>
          <Ionicons name="add-circle-outline" size={28} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {isHR && (
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Search by name, employee, or type..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      <FlatList 
        data={displayDocs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={{color: theme.textSecondary, textAlign: 'center', marginTop: 40}}>No credentials found.</Text>}
      />

      <Modal visible={showStatusModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={{fontSize: 20, fontWeight: 'bold', color: theme.text}}>Manage Credential</Text>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('View', 'Mock view document functionality')}>
              <Text style={[styles.actionText, {color: theme.primary}]}>View Document</Text>
            </TouchableOpacity>

            {selectedDoc?.status !== 'Approved' && (
              <TouchableOpacity style={styles.actionBtn} onPress={() => changeStatus('Approved')}>
                <Text style={[styles.actionText, {color: theme.success}]}>Mark as Approved</Text>
              </TouchableOpacity>
            )}

            {selectedDoc?.status !== 'Rejected' && (
              <TouchableOpacity style={styles.actionBtn} onPress={() => changeStatus('Rejected')}>
                <Text style={[styles.actionText, {color: theme.danger}]}>Mark as Rejected</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.actionBtn, {borderBottomWidth: 0}]} onPress={removeDoc}>
              <Text style={[styles.actionText, {color: theme.danger}]}>Delete Document</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
