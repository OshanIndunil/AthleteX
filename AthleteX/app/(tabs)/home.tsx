import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, SafeAreaView, StatusBar, Alert } from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, logout } from '../../redux/store';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [teams, setTeams] = useState<any[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const dispatch = useDispatch();
  const router = useRouter(); 
  const favorites = useSelector((state: any) => state.favorites.items);
  
  const user = useSelector((state: any) => state.auth.user);
  const username = user?.firstName || user?.username || "Guest";

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(
        'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=English%20Premier%20League'
      );
      setTeams(response.data.teams);
      setFilteredTeams(response.data.teams);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = teams.filter((t) => t.strTeam.toLowerCase().includes(text.toLowerCase()));
    setFilteredTeams(filtered);
  }

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: () => {
            dispatch(logout());
            router.replace('/'); 
          }
        }
      ]
    );
  };

  const goToDetails = (item: any) => {
    const badgeUrl = item.strTeamBadge || item.strBadge || `https://www.thesportsdb.com/images/media/team/badge/${item.idTeam}.png`;
    const itemWithBadge = { ...item, strTeamBadge: badgeUrl };

    router.push({
        pathname: "/details",
        params: { teamData: JSON.stringify(itemWithBadge) }
    } as any); 
  };

  const renderItem = ({ item }: { item: any }) => {
    const isFav = favorites.some((fav: any) => fav.idTeam === item.idTeam);
    const badgeUrl = item.strTeamBadge || item.strBadge || `https://www.thesportsdb.com/images/media/team/badge/${item.idTeam}.png`;

    return (
      <TouchableOpacity onPress={() => goToDetails(item)} activeOpacity={0.9}>
        <View style={styles.card}>
            <View style={styles.cardContent}>
                 <Image source={{ uri: badgeUrl }} style={styles.teamBadge} resizeMode="contain" />
                 <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.strTeam}</Text>
                    <Text style={styles.subtitle}>{item.strStadium}</Text>
                 </View>
                 <TouchableOpacity onPress={() => dispatch(toggleFavorite(item))} style={styles.favBtn}>
                    <Feather name="heart" size={24} color={isFav ? "#ff4757" : "#ccc"} />
                 </TouchableOpacity>
            </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View>
            {/* UPDATED TEXT HERE */}
            <Text style={styles.appTitle}>AthleteX</Text>
            <Text style={styles.appSubtitle}>
            Welcome back, <Text style={{fontWeight:'bold', color: '#007bff'}}>{username}</Text> 👋
            </Text>
        </View>
        
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Feather name="log-out" size={24} color="#ff4757" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" style={{ marginRight: 10 }} />
        <TextInput 
            placeholder="Search teams..." 
            style={styles.searchInput} 
            value={search}
            onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
            data={filteredTeams}
            keyExtractor={(item: any) => item.idTeam}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 15, paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { 
    padding: 20, 
    paddingTop: 10, 
    backgroundColor: '#fff',
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  appTitle: { fontSize: 32, fontWeight: '800', color: '#1a1a1a' },
  appSubtitle: { fontSize: 16, color: '#666', marginTop: 2 },
  logoutBtn: { padding: 10, backgroundColor: '#fff0f0', borderRadius: 12 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, marginTop: 10, marginBottom: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
  searchInput: { flex: 1, fontSize: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  cardContent: { flexDirection: 'row', padding: 15, alignItems: 'center' },
  teamBadge: { width: 60, height: 60, marginRight: 15 },
  textContainer: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2d3436' },
  subtitle: { fontSize: 13, color: '#636e72', marginTop: 2 },
  favBtn: { padding: 5 },
});