import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../../redux/store';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FavoritesScreen() {
  const favorites = useSelector((state: any) => state.favorites.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const goToDetails = (item: any) => {
    
    const badgeUrl = item.strTeamBadge || item.strBadge || `https://www.thesportsdb.com/images/media/team/badge/${item.idTeam}.png`;
    const itemWithBadge = { ...item, strTeamBadge: badgeUrl };

    router.push({
        pathname: "/details",
        params: { teamData: JSON.stringify(itemWithBadge) }
    } as any); 
  };

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
          keyExtractor={(item: any) => item.idTeam}
          renderItem={({ item }: { item: any }) => {
            
            const badgeUrl = item.strTeamBadge || item.strBadge || `https://www.thesportsdb.com/images/media/team/badge/${item.idTeam}.png`;

            return (
                <TouchableOpacity onPress={() => goToDetails(item)} activeOpacity={0.9}>
                    <View style={styles.card}>
                   
                    <Image source={{ uri: badgeUrl }} style={styles.image} resizeMode="contain" />
                    
                    <View style={styles.info}>
                        <Text style={styles.title}>{item.strTeam}</Text>
                        <Text style={styles.subtitle}>Est. {item.intFormedYear}</Text>
                    </View>
                    
                    <TouchableOpacity onPress={() => dispatch(toggleFavorite(item))} style={styles.favBtn}>
                        <Feather name="trash-2" size={24} color="red" />
                    </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            );
          }}
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: 60, height: 60, marginRight: 15 },
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  favBtn: { padding: 5 },
});