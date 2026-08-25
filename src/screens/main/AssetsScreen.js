import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../../store/useAuthStore';
import useThemeStore from '../../store/useThemeStore';
import useAssetStore from '../../store/useAssetStore';
import { COLORS, SIZES } from '../../constants/theme';

export default function AssetsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const { assets } = useAssetStore();
  const [search, setSearch] = useState('');
  
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const isHR = user?.role === 'HR';

  // Filter based on role and search query
  const displayAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) || asset.id.toLowerCase().includes(search.toLowerCase());
    if (isHR) return matchesSearch;
    return matchesSearch && (asset.assignedTo === user?.id || asset.assignedName === user?.name);
  });

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

    searchInput: {
      backgroundColor: theme.background,
      margin: SIZES.padding,
      padding: 12,
      borderRadius: SIZES.radius,
      borderWidth: 1,
      borderColor: theme.border,
      color: theme.text,
      fontSize: SIZES.md,
    },
    list: {
      paddingHorizontal: SIZES.padding,
      paddingBottom: SIZES.padding * 2,
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
      marginBottom: 8,
    },
    assetName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    assetType: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    assignedTo: {
      fontSize: 14,
      color: theme.text,
      marginTop: 8,
      fontWeight: '500',
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: 'bold',
    }
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return theme.success;
      case 'Assigned': return theme.primary;
      case 'Maintenance': return theme.warning;
      default: return theme.textSecondary;
    }
  };

  const renderItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => isHR ? navigation.navigate('AssetDetail', { asset: item }) : null}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.assetName}>{item.name}</Text>
            <Text style={styles.assetType}>{item.id} • {item.type}</Text>
          </View>
        </View>
        
        {isHR && (
          <Text style={styles.assignedTo}>
            {item.status === 'Assigned' ? `Assigned to: ${item.assignedName}` : 'Unassigned'}
          </Text>
        )}
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{item.status}</Text>
          </View>
          {isHR && <Text style={{color: theme.primary, fontWeight: 'bold'}}>Manage ➔</Text>}
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
          <Text style={styles.headerTitle}>{isHR ? 'Company Assets' : 'My Assets'}</Text>
        </View>
        {isHR && (
          <TouchableOpacity onPress={() => navigation.navigate('AddAsset')}>
            <Ionicons name="add-circle" size={32} color={theme.primary} />
          </TouchableOpacity>
        )}
      </View>

      <TextInput 
        style={styles.searchInput}
        placeholder="Search assets by name or ID..."
        placeholderTextColor={theme.textSecondary}
        value={search}
        onChangeText={setSearch}
      />
      
      <FlatList 
        data={displayAssets}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}
