import { useContext } from 'react';

import Head from 'next/head';
import NextLink from 'next/link';

import jsCookies from 'js-cookie';

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
  Switch,
  Badge,
  IconButton,
  Button
} from '@mui/material';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import classes from '../utils/classes';
import { Store } from '../utils/Store';


export default function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);

  const { darkMode, cart, userInfo } = state;
  console.log(userInfo);

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
        main: '#1c99d5',
      },
      secondary: {
        main: '#006BB8',
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
            <Box display="flex" flexWrap="wrap-reverse" justifyContent="center">
              <NextLink href="/cart" passHref>
                <Link>
                  <IconButton sx={classes.appBarButton}>
                    {cart.cartItems.length > 0 ? (
                      <Badge color="secondary" badgeContent={cart.cartItems.length}>
                        <ShoppingCartIcon />
                      </Badge>
                    ) : (<ShoppingCartIcon />)}  
                  </IconButton>  
                </Link>
              </NextLink>
              {userInfo ? (
                <NextLink href="/profile" passHref>
                  <Link>
                    <Button sx={classes.appBarButton}>
                      <AccountCircleIcon  />
                      <Typography sx={{ textTransform: 'capitalize', marginLeft: '2px' }}>
                        Hi, {userInfo.lastName}
                      </Typography>
                    </Button>
                  </Link>
                </NextLink>) : 
                (<NextLink href="/login" passHref>
                  <Link>
                    <IconButton sx={classes.appBarButton}>
                      <AccountCircleIcon  />
                    </IconButton>
                  </Link>
                </NextLink>
              )}
              <Switch checked={darkMode} onChange={changeDarkModeHandler} color="secondary"></Switch>
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
