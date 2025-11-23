import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../../redux/store';
import { Feather } from '@expo/vector-icons';

export default function FavoritesScreen() {
  // FIX: Added ': any' so TypeScript stops complaining about 'state'
  const favorites = useSelector((state: any) => state.favorites.items);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.center}>
          <Feather name="heart" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No favorites yet!</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          // FIX: Added ': any' to item
          keyExtractor={(item: any) => item.idTeam}
          renderItem={({ item }: { item: any }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.strTeamBadge }} style={styles.image} resizeMode="contain" />
              <View style={styles.info}>
                <Text style={styles.title}>{item.strTeam}</Text>
                <Text style={styles.subtitle}>Est. {item.intFormedYear}</Text>
              </View>
              <TouchableOpacity onPress={() => dispatch(toggleFavorite(item))}>
                <Feather name="trash-2" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 10, fontSize: 16, color: '#888' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: 60, height: 60, marginRight: 15 },
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
});