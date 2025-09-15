import { StyleSheet, View, FlatList, RefreshControl, Image, Alert } from 'react-native';
import { Text, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AppKitButton } from '@reown/appkit-wagmi-react-native';

// Define the crypto data structure
type Cryptocurrency = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
};

// Define the team selection structure
type TeamSelection = {
  crypto: Cryptocurrency;
  prediction: 'up' | 'down';
};

export default function HomeScreen() {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCryptos, setSelectedCryptos] = useState<Record<string, 'up' | 'down' | null>>({});
  const [team, setTeam] = useState<TeamSelection[]>([]);

  // Fetch crypto data from CoinGecko API
  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false'
      );
      const data = await response.json();
      setCryptos(data);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCryptoData();
  }, []);

  // Update team when selections change
  useEffect(() => {
    const newTeam: TeamSelection[] = [];
    Object.entries(selectedCryptos).forEach(([id, prediction]) => {
      if (prediction !== null) {
        const crypto = cryptos.find(c => c.id === id);
        if (crypto) {
          newTeam.push({ crypto, prediction });
        }
      }
    });
    setTeam(newTeam);
  }, [selectedCryptos, cryptos]);

  // Refresh function for pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchCryptoData();
  };

  // Handle crypto selection for up/down prediction
  const handleCryptoSelect = (id: string, prediction: 'up' | 'down') => {
    // Check if user is trying to add a 6th token
    const currentSelections = Object.values(selectedCryptos).filter(Boolean).length;
    const isAlreadySelected = selectedCryptos[id] === prediction;
    
    if (!isAlreadySelected && currentSelections >= 5) {
      Alert.alert(
        'Team Full',
        'You can only select up to 5 tokens for your team.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setSelectedCryptos(prev => ({
      ...prev,
      [id]: prev[id] === prediction ? null : prediction
    }));
  };

  // View team function
  const viewTeam = () => {
    if (team.length === 0) {
      Alert.alert(
        'Empty Team',
        'Please select at least one token for your team.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    let teamMessage = `Your Team (${team.length}/5):\n\n`;
    team.forEach((selection, index) => {
      teamMessage += `${index + 1}. ${selection.crypto.name} (${selection.crypto.symbol.toUpperCase()}) - Predicted: ${selection.prediction.toUpperCase()}\n`;
    });
    
    Alert.alert(
      'Your Team',
      teamMessage,
      [{ text: 'OK' }]
    );
  };

  // Render individual crypto item
  const renderCryptoItem = ({ item }: { item: Cryptocurrency }) => {
    const isSelected = selectedCryptos[item.id];
    
    return (
      <View style={styles.cryptoItem}>
        <View style={styles.cryptoInfo}>
          <Text style={styles.cryptoName}>{item.name}</Text>
          <Text style={styles.cryptoSymbol}>{item.symbol.toUpperCase()}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.cryptoPrice}>${item.current_price.toLocaleString()}</Text>
          <Text style={[
            styles.priceChange,
            { color: item.price_change_percentage_24h >= 0 ? 'green' : 'red' }
          ]}>
            {item.price_change_percentage_24h >= 0 ? '↑' : '↓'} 
            {Math.abs(item.price_change_percentage_24h).toFixed(2)}%
          </Text>
        </View>
        <View style={styles.predictionContainer}>
          <TouchableOpacity 
            style={[
              styles.predictionButton, 
              styles.upButton,
              isSelected === 'up' && styles.selectedUpButton
            ]}
            onPress={() => handleCryptoSelect(item.id, 'up')}
          >
            <Text style={styles.predictionText}>↑</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.predictionButton, 
              styles.downButton,
              isSelected === 'down' && styles.selectedDownButton
            ]}
            onPress={() => handleCryptoSelect(item.id, 'down')}
          >
            <Text style={styles.predictionText}>↓</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading crypto prices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSpacer} />
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://placehold.co/40' }} 
          style={styles.logo}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.headerButton} onPress={viewTeam}>
            <Text style={styles.buttonText}>View Team</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <FontAwesome name="search" size={20} color="black" />
          </TouchableOpacity>
          <AppKitButton />
        </View>
      </View>
      <FlatList
        data={cryptos}
        renderItem={renderCryptoItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
  },
  headerSpacer: {
    height: 80, // Creates space at the top
  },
  header: {
    position: 'absolute',
    top: 40, // Positioned below the status bar
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  cryptoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cryptoSymbol: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  cryptoPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceChange: {
    fontSize: 14,
  },
  predictionContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  predictionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upButton: {
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'green',
  },
  downButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'red',
  },
  selectedUpButton: {
    backgroundColor: 'green',
  },
  selectedDownButton: {
    backgroundColor: 'red',
  },
  predictionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});