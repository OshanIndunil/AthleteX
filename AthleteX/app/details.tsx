import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';

export default function DetailsScreen() {
  const { teamData } = useLocalSearchParams();
  const router = useRouter(); 
  
  const team = useMemo(() => {
    return teamData ? JSON.parse(teamData as string) : null;
  }, [teamData]);

  const [activeTab, setActiveTab] = useState('Overview'); 
  const [matches, setMatches] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (team?.idTeam) {
      fetchDetails();
    }
  }, [team?.idTeam]);

  const fetchDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const matchRes = await axios.get(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${team.idTeam}`);
      setMatches(matchRes.data.results || []);

      const playerRes = await axios.get(`https://www.thesportsdb.com/api/v1/json/3/lookup_all_players.php?id=${team.idTeam}`);
      setPlayers(playerRes.data.player || []);
    } catch (error) {
      console.log("Error fetching details", error);
    }
    setLoading(false);
  };

  if (!team) return <View><Text>No Data</Text></View>;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      
      <ImageBackground 
        source={{ uri: team.strTeamBanner || team.strTeamBadge }} 
        style={styles.headerBackground}
      >
        <LinearGradient colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']} style={styles.gradient} />
        
       
        <Image source={{ uri: team.strTeamBadge }} style={styles.mainImage} resizeMode="contain" />
        
        <View style={styles.headerContent}>
            <Text style={styles.teamName}>{team.strTeam}</Text>
            <Text style={styles.league}>{team.strLeague}</Text>
        </View>
      </ImageBackground>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {['Overview', 'Matches', 'Squad'].map((tab) => (
        <TouchableOpacity 
          key={tab} 
          onPress={() => setActiveTab(tab)} 
          style={[styles.tab, activeTab === tab && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOverview = () => (
    <View style={styles.section}>
      <View style={styles.infoCard}>
        <View style={styles.row}>
          <Feather name="map-pin" size={18} color="#007bff" />
          <Text style={styles.infoText}>{team.strStadium}</Text>
        </View>
        <View style={styles.row}>
          <Feather name="calendar" size={18} color="#007bff" />
          <Text style={styles.infoText}>Est. {team.intFormedYear}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>About</Text>
      <Text style={styles.description}>{team.strDescriptionEN}</Text>
      
      {team.strTeamJersey && (
        <>
          <Text style={styles.sectionTitle}>Jersey</Text>
          <Image source={{ uri: team.strTeamJersey }} style={styles.jersey} resizeMode="contain" />
        </>
      )}
    </View>
  );

  const renderMatches = () => (
    <View style={styles.section}>
      {matches.map((match) => (
        <View key={match.idEvent} style={styles.matchCard}>
          <Text style={styles.date}>{match.dateEvent}</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.teamScore}>{match.strHomeTeam}</Text>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreText}>{match.intHomeScore} - {match.intAwayScore}</Text>
            </View>
            <Text style={styles.teamScore}>{match.strAwayTeam}</Text>
          </View>
        </View>
      ))}
      {matches.length === 0 && <Text style={{textAlign:'center', marginTop: 20}}>No recent match data available.</Text>}
    </View>
  );

  const renderSquad = () => (
    <View style={styles.grid}>
      {players.map((player) => (
        <View key={player.idPlayer} style={styles.playerCard}>
          <Image 
            source={{ uri: player.strCutout || player.strThumb || 'https://via.placeholder.com/150' }} 
            style={styles.playerImage} 
          />
          <Text style={styles.playerName} numberOfLines={1}>{player.strPlayer}</Text>
          <Text style={styles.playerPosition}>{player.strPosition}</Text>
        </View>
      ))}
      {players.length === 0 && <Text style={{textAlign:'center', marginTop: 20, width: '100%'}}>No player data available.</Text>}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

     
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="white" />
      </TouchableOpacity>

      <ScrollView>
        {renderHeader()}
        {renderTabs()}
        
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
        ) : (
          <>
            {activeTab === 'Overview' && renderOverview()}
            {activeTab === 'Matches' && renderMatches()}
            {activeTab === 'Squad' && renderSquad()}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 50, left: 20, zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 25,
  },
  headerContainer: { height: 300, backgroundColor: '#222' },
  headerBackground: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  gradient: { position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 },
  
  // Big Center Logo
  mainImage: { width: 150, height: 150, marginBottom: 40 },
  
  headerContent: { position: 'absolute', bottom: 20, alignItems: 'center', width: '100%' },
  teamName: { color: 'white', fontSize: 28, fontWeight: 'bold', textAlign: 'center', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10 },
  league: { color: '#ddd', fontSize: 16, marginTop: 4 },
  
  tabContainer: { flexDirection: 'row', backgroundColor: 'white', padding: 10, justifyContent: 'space-around', elevation: 2 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  activeTab: { backgroundColor: '#007bff' },
  tabText: { color: '#666', fontWeight: '600' },
  activeTabText: { color: 'white' },

  section: { padding: 20 },
  infoCard: { backgroundColor: 'white', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontWeight: '600', color: '#333' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  description: { lineHeight: 22, color: '#555', marginBottom: 20 },
  jersey: { width: 150, height: 150, alignSelf: 'center' },

  matchCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 12, elevation: 2 },
  date: { fontSize: 12, color: '#888', textAlign: 'center', marginBottom: 8 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  teamScore: { flex: 1, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  scoreBox: { backgroundColor: '#f0f2f5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  scoreText: { fontWeight: 'bold', fontSize: 16 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, justifyContent: 'space-between' },
  playerCard: { width: '31%', backgroundColor: 'white', marginBottom: 10, borderRadius: 8, alignItems: 'center', padding: 8, elevation: 2 },
  playerImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 5, backgroundColor: '#eee' },
  playerName: { fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
  playerPosition: { fontSize: 10, color: '#666' },
});