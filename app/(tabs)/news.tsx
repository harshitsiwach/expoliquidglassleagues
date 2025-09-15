import { StyleSheet, View, ActivityIndicator, Text, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';

// Define the news article structure
type NewsArticle = {
  id: string;
  title: string;
  body: string;
  url: string;
  imageurl: string;
  published_on: number;
  source_info: {
    name: string;
  };
};

export default function NewsScreen() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch crypto news from CryptoCompare API
  const fetchCryptoNews = async () => {
    try {
      // Using CryptoCompare API with direct fetch
      const url = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.Type !== 100) {
        throw new Error(data.Message || 'Failed to fetch news');
      }
      
      // Process articles and add IDs
      const processedArticles = data.Data.map((article: any, index: number) => ({
        ...article,
        id: index.toString()
      }));
      
      setArticles(processedArticles);
      setError(null);
    } catch (err) {
      console.error('Error fetching crypto news:', err);
      setError('Failed to fetch crypto news. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCryptoNews();
  }, []);

  // Refresh function for pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchCryptoNews();
  };

  // Navigate to next article
  const nextArticle = () => {
    if (articles.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
    }
  };

  // Navigate to previous article
  const prevArticle = () => {
    if (articles.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + articles.length) % articles.length);
    }
  };

  // Render slideshow item
  const renderSlideshowItem = () => {
    if (articles.length === 0) return null;
    
    const article = articles[currentIndex];
    
    return (
      <View style={styles.slide}>
        {article.imageurl ? (
          <Image 
            source={{ uri: article.imageurl }} 
            style={styles.articleImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <View style={styles.articleContent}>
          <Text style={styles.articleTitle}>{article.title}</Text>
          <Text style={styles.articleDescription} numberOfLines={3}>{article.body}</Text>
          <View style={styles.articleMeta}>
            <Text style={styles.source}>{article.source_info.name}</Text>
            <Text style={styles.date}>
              {new Date(article.published_on * 1000).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading crypto news...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={fetchCryptoNews}>
          Tap to retry
        </Text>
      </View>
    );
  }

  // Empty state
  if (articles.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emptyText}>No crypto news available at the moment.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Crypto News</Text>
      
      {/* Slideshow */}
      <View style={styles.slideshowContainer}>
        {renderSlideshowItem()}
        
        {/* Navigation buttons */}
        <View style={styles.navigation}>
          <TouchableOpacity style={styles.navButton} onPress={prevArticle}>
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          
          <Text style={styles.indicator}>
            {currentIndex + 1} / {articles.length}
          </Text>
          
          <TouchableOpacity style={styles.navButton} onPress={nextArticle}>
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Article list */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>More News</Text>
      </View>
      
      <FlatList
        data={articles}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.articleItem}
            onPress={() => setCurrentIndex(articles.indexOf(item))}
          >
            {item.imageurl ? (
              <Image 
                source={{ uri: item.imageurl }} 
                style={styles.articleItemImg}
              />
            ) : (
              <View style={styles.placeholderImageSmall} />
            )}
            <View style={styles.articleItemContent}>
              <Text style={styles.articleItemTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.articleItemSource}>{item.source_info.name}</Text>
            </View>
          </TouchableOpacity>
        )}
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
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  slideshowContainer: {
    height: 300,
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  slide: {
    flex: 1,
  },
  articleImage: {
    width: '100%',
    height: 180,
  },
  placeholderImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#ccc',
  },
  articleContent: {
    padding: 15,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  articleDescription: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  source: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  indicator: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  articleItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  articleItemImg: {
    width: 80,
    height: 80,
  },
  placeholderImageSmall: {
    width: 80,
    height: 80,
    backgroundColor: '#ccc',
  },
  articleItemContent: {
    flex: 1,
    padding: 10,
  },
  articleItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  articleItemSource: {
    fontSize: 12,
    color: '#666',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});