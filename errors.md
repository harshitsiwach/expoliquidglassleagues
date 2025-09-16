iOS Bundling failed 12ms node_modules/expo-router/entry.js (1 module)
Unable to resolve "@/hooks/useAppTheme" from "app/(tabs)/hyperliquid.tsx"
  2 | import { useEffect, useState } from 'react';
  3 | import { Hyperliquid } from 'hyperliquid';
> 4 | import { useAppTheme } from '@/hooks/useAppTheme';
    |                              ^
  5 |
  6 | // Define the market data structure
  7 | type MarketData = {

Import stack:

 app/(tabs)/hyperliquid.tsx
 | import "@/hooks/useAppTheme"

 app (require.context)

 