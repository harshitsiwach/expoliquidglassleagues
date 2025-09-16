# Glass - Expo SDK 54 Liquid Glass Application

## Project Overview

This is a React Native Expo application built with Expo SDK 54 that leverages iOS 26 Liquid Glass components and integrates with multiple financial data sources including Hyperliquid (decentralized perpetuals exchange) and Polymarket (prediction markets). The app features a modern UI with native iOS glass effects using Expo's new liquid glass libraries.

### Key Features

1. **Liquid Glass UI**: Implements iOS 26 native glass effects using `expo-glass-effect`, `expo-liquid-glass-view`, and `@expo/ui/swift-ui`
2. **Multi-tab Navigation**: Uses Expo Router v6 with native tabs that automatically provide liquid glass styling on iOS 26+
3. **Financial Data Integration**:
   - Hyperliquid perpetuals exchange data (real-time prices, order books, funding rates)
   - Polymarket prediction market data (trending markets, outcomes, prices)
   - Cryptocurrency market data from CoinGecko
4. **Dark/Light Theme Support**: Automatic theme switching with custom theme context
5. **Responsive Design**: Adaptive layouts for different screen sizes

### Technologies Used

- **Expo SDK 54**: Core framework with iOS 26 liquid glass support
- **React Native**: Cross-platform mobile development
- **Expo Router v6**: File-based routing with native tabs
- **TypeScript**: Type safety throughout the application
- **Supabase**: Backend-as-a-Service (authentication, database, storage)
- **Hyperliquid SDK**: For decentralized perpetuals exchange data
- **Polymarket API**: For prediction market data
- **CoinGecko API**: For general cryptocurrency market data
- **Expo UI (Beta)**: SwiftUI primitives with glass modifiers
- **React Navigation**: For complex navigation flows

## Project Structure

```
app/                    # File-based routing with Expo Router
  (tabs)/               # Tab navigator screens
    _layout.tsx         # Tab layout with native glass tabs
    index.tsx           # Home screen (crypto markets)
    hyperliquid.tsx     # Hyperliquid perpetuals data
    polymarket.tsx      # Polymarket prediction markets
    news.tsx            # News feed (placeholder)
    search.tsx          # Search functionality (placeholder)
  _layout.tsx           # Root layout
  modal.tsx             # Modal screen
assets/                 # Static assets (images, icons)
components/             # Reusable UI components
constants/              # Application constants (themes, etc.)
contexts/               # React contexts (ThemeContext)
hooks/                  # Custom hooks
lib/                    # Utility libraries and SDK integrations
scripts/                # Automation scripts
```

## Building and Running

### Prerequisites

- Node.js 18+
- Expo CLI
- Xcode 16.1+ (for iOS development with liquid glass effects)
- iOS 26+ device/simulator (for liquid glass effects)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npx expo start

# Start on iOS simulator
npx expo run:ios

# Start on Android emulator
npx expo run:android

# Start for web development
npx expo start --web
```

### Platform Requirements

- **iOS 26+** for liquid glass effects
- **Xcode 16.1+** for compilation
- **macOS 14+** for development
- Automatic fallback to regular views on unsupported platforms

## Development Conventions

### UI Components

The app uses three approaches for liquid glass UI:

1. **expo-glass-effect**: UIKit-based glass components using `UIVisualEffectView`
2. **expo-liquid-glass-view**: SwiftUI-powered liquid glass views with advanced customization
3. **@expo/ui/swift-ui**: SwiftUI primitives with glass modifiers (beta)

### File-Based Routing

The app uses Expo Router v6 with file-based routing:
- `app/` directory contains all screens
- `(tabs)/` directory contains tab navigator screens
- `_layout.tsx` files define layout wrappers
- File names determine route paths

### Theming

The app implements a custom theme system:
- Light/dark theme support
- Automatic system preference detection
- Custom color palette in `constants/theme.ts`
- Theme context provider in `contexts/ThemeContext.tsx`

### Data Integration Patterns

1. **API Data Fetching**: Using native `fetch` with proper error handling
2. **State Management**: React hooks (`useState`, `useEffect`) for local component state
3. **Loading States**: Activity indicators and skeleton screens
4. **Error Handling**: User-friendly error messages with retry functionality
5. **Pull-to-Refresh**: For manual data refreshing

### Polyfills

Required polyfills for React Native compatibility:
```javascript
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { encode, decode } from 'base-64';
```

## Key Integrations

### Hyperliquid Integration

- Uses the Hyperliquid TypeScript SDK
- Displays perpetuals market data (prices, funding rates, open interest)
- Implements proper polyfills for React Native compatibility
- Handles rate limiting and error cases

### Polymarket Integration

- Fetches data from Polymarket's public API
- Displays prediction markets with outcomes and probabilities
- Parses JSON strings for outcomes and prices
- Formats volume numbers for better readability

### Supabase Integration

- Authentication (email/password, OAuth)
- Database operations (CRUD)
- Realtime subscriptions
- File storage
- Edge functions

## Performance Considerations

1. **Conditional Rendering**: Glass effects only rendered on supported devices
2. **Memoization**: Use of `useMemo` and `memo` for expensive calculations
3. **Virtualized Lists**: `FlatList` for efficient rendering of large datasets
4. **Caching**: In-memory caching for frequently accessed data
5. **Connection Optimization**: Proper WebSocket management

## Troubleshooting

### Common Issues

1. **Glass Effects Not Appearing**:
   - Verify iOS 26+ device/simulator
   - Ensure Xcode 16.1+ compilation
   - Check library installation

2. **API Data Not Loading**:
   - Check network connectivity
   - Verify API endpoints are accessible
   - Check for proper error handling

3. **Theme Issues**:
   - Ensure ThemeProvider wraps the application
   - Check theme context usage in components

### Debugging

```bash
# Enable verbose logging
npx expo start --dev-client

# Clear cache
npx expo start -c

# Reset project (removes starter code)
npm run reset-project
```

## Future Enhancements

1. **Wallet Integration**: Add Reown AppKit for wallet connectivity
2. **Real-time Updates**: Implement WebSocket connections for live data
3. **Advanced Charts**: Add tradingview or custom charting components
4. **Push Notifications**: For price alerts and market updates
5. **Offline Support**: Implement data caching for offline usage
6. **Advanced Trading Features**: Order placement, position management

## Documentation References

- [Expo SDK 54 Liquid Glass Guide](expodocs.md)
- [Hyperliquid SDK Integration](hyperliquiddocs.md)
- [Polymarket API Integration](polymarketapiresponse.md)
- [Supabase Integration](supabasedocs.md)