// import '../styles/globals.css';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

import { StoreProvider } from '../utils/Store';

const clientSideEmotionCache = createCache({ key: 'css'});

export default function App({ Component, pageProps, emotionCache = clientSideEmotionCache }) {
  return (
    <CacheProvider value={emotionCache}>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </CacheProvider>
  );
}
