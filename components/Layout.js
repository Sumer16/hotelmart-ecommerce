import Head from 'next/head';
import NextLink from 'next/link';

import { useContext } from 'react';

import { createTheme } from '@mui/material/styles';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Link,
  Typography,
  Container,
  Box,
  Switch
} from '@mui/material';

import classes from '../utils/classes';
import { Store } from '../utils/Store';
import jsCookies from 'js-cookie';

export default function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);
  const { darkMode } = state;

  const theme = createTheme({
    components: {
      MuiLink: {
        defaultProps: {
          underline: 'none',
        }
      },
    },
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#006BB8',
      },
      secondary: {
        main: '#1c99d5',
      },
    },
  });

  const changeDarkModeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const enableDarkMode = !darkMode;
    jsCookies.set('darkMode', enableDarkMode ? 'ON' : 'OFF');
  }

  return (
    <>
      <Head>
        <title>
          {title ? `${title} - Relay Ecommerce` : 'Relay Ecommerce'}
        </title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" sx={classes.appbar}>
          <Toolbar sx={classes.toolbar}>
            <Box display="flex" alignItems="center">
              <NextLink href="/" passHref>
                <Link>
                  <Typography sx={classes.brand}>Relay ECommerce</Typography>
                </Link>
              </NextLink>
            </Box>
            <Box>
              <Switch checked={darkMode} onChange={changeDarkModeHandler}></Switch>
            </Box>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={classes.main}>{children}</Container>
        <Box component="footer" sx={classes.footer}>
          <Typography>All rights reserved. Relay Ecommerce.</Typography>
        </Box>
      </ThemeProvider>
    </>
  )
}
