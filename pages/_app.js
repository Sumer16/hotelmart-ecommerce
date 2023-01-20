// import '../styles/globals.css';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { SnackbarProvider } from 'notistack';

import { StoreProvider } from '../utils/Store';

const clientSideEmotionCache = createCache({ key: 'css'});

export default function App({ Component, pageProps, emotionCache = clientSideEmotionCache }) {
  return (
    <CacheProvider value={emotionCache}>
      <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <StoreProvider>
          <Component {...pageProps} />
        </StoreProvider>
      </SnackbarProvider>
    </CacheProvider>
  );
}
