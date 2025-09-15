import { StyleSheet, View, FlatList, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { Text } from 'react-native';
import { useState, useEffect } from 'react';

// Define the Polymarket market structure
type PolymarketMarket = {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  endDate: string;
  category: string;
  volume: string;
  active: boolean;
  closed: boolean;
  volumeNum: number;
  volume24hr: number;
  outcomes: string; // JSON string
  outcomePrices: string; // JSON string
  image: string | null;
  description: string;
  
  // Computed properties (we'll parse these in the component)
  parsedOutcomes: string[];
  parsedPrices: number[];
  formattedVolume: string;
};

export default function PolymarketScreen() {
  const [markets, setMarkets] = useState<PolymarketMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse outcomes from JSON string
  const parseOutcomes = (outcomes: string): string[] => {
    try {
      const data = JSON.parse(outcomes);
      return Array.isArray(data) ? data : ["Yes", "No"];
    } catch {
      return ["Yes", "No"];
    }
  };

  // Parse prices from JSON string
  const parsePrices = (prices: string): number[] => {
    try {
      const data = JSON.parse(prices);
      if (Array.isArray(data)) {
        return data.map(p => parseFloat(p) || 0);
      }
      return [0, 0];
    } catch {
      return [0, 0];
    }
  };

  // Format volume number
  const formatVolume = (volumeNum: number): string => {
    if (volumeNum >= 1_000_000) {
      return `${(volumeNum / 1_000_000).toFixed(1)}M`;
    } else if (volumeNum >= 1_000) {
      return `${(volumeNum / 1_000).toFixed(1)}K`;
    } else {
      return `${Math.round(volumeNum)}`;
    }
  };

  // Fetch Polymarket data
  const fetchPolymarketData = async () => {
    try {
      const response = await fetch(
        'https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=10'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process the data to add computed properties
      const processedMarkets = data.map((market: any) => ({
        ...market,
        parsedOutcomes: parseOutcomes(market.outcomes),
        parsedPrices: parsePrices(market.outcomePrices),
        formattedVolume: formatVolume(market.volumeNum)
      }));
      
      setMarkets(processedMarkets);
      setError(null);
    } catch (err) {
      console.error('Error fetching Polymarket data:', err);
      setError('Failed to fetch Polymarket data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchPolymarketData();
  }, []);

  // Refresh function for pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchPolymarketData();
  };

  // Render individual market item
  const renderMarketItem = ({ item }: { item: PolymarketMarket }) => (
    <View style={styles.marketCard}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.marketImage} />
      ) : null}
      <View style={styles.cardContent}>
        <Text style={styles.question}>{item.question}</Text>
        
        <View style={styles.metadata}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.volume}>{item.formattedVolume}</Text>
        </View>
        
        <View style={styles.outcomesContainer}>
          {item.parsedOutcomes.slice(0, 2).map((outcome, index) => {
            const price = item.parsedPrices[index] || 0;
            const percentage = Math.round(price * 100);
            
            return (
              <View key={index} style={styles.outcome}>
                <Text style={styles.outcomeText}>{outcome}</Text>
                <Text style={styles.price}>{percentage}%</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading Polymarket data...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={fetchPolymarketData}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trending Polymarkets</Text>
      <FlatList
        data={markets}
        renderItem={renderMarketItem}
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#000',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  marketCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  marketImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 15,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  category: {
    backgroundColor: 'rgba(0, 0, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: '#000',
  },
  volume: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'green',
  },
  outcomesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  outcome: {
    alignItems: 'center',
    flex: 1,
  },
  outcomeText: {
    fontSize: 14,
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});