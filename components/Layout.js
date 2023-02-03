import { useContext, useEffect, useState } from 'react';

import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { useSnackbar } from 'notistack';
import jsCookies from 'js-cookie';

import {
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
  Button,
  Fade,
  Menu,
  MenuItem,
  ThemeProvider,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import classes from '../utils/classes';
import { Store } from '../utils/Store';

export default function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);

  const { darkMode, cart, userInfo } = state;

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

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

  // Solved rehydrate issue using this -> https://www.joshwcomeau.com/react/the-perils-of-rehydration/
  const [hasMounted, setHasMounted] = useState(false);

  const [ anchorEl, setAnchorEl ] = useState(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const changeDarkModeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const enableDarkMode = !darkMode;
    jsCookies.set('darkMode', enableDarkMode ? 'ON' : 'OFF');
  }

  const open = Boolean(anchorEl);

  if (!hasMounted) {
    return null;
  }

  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);

    if (redirect !== 'backdropClick') {
      router.push(redirect);
    } else {
      return;
    }
  };

  const loginMenuClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    
    dispatch({ type: 'USER_LOGOUT' });
    
    jsCookies.remove('userInfo');
    jsCookies.remove('cartItems');
    jsCookies.remove('paymentMethod');

    enqueueSnackbar("You have been successfully logged out!", { variant: 'success' });
    
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>
          {title ? `${title} | RelayMart` : 'RelayMart'}
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
                  <Typography sx={classes.brand}>RelayMart</Typography>
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
              {userInfo ? 
                (<>
                  <Button
                    id="fade-button"
                    aria-controls={open ? 'fade-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={loginMenuClickHandler}
                    sx={classes.appBarButton}
                  >
                    <AccountCircleIcon  />
                    <Typography sx={{ marginLeft: '2px' }} variant="body1">
                      Hi, {userInfo.lastName}
                    </Typography>
                  </Button>
                  <Menu
                    id="fade-menu"
                    MenuListProps={{
                      'aria-labelledby': 'fade-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    keepMounted
                    onClose={loginMenuCloseHandler}
                    TransitionComponent={Fade}
                  >
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>) : 
                (<NextLink href="/login" passHref>
                  <Link>
                    <IconButton sx={classes.appBarButton}>
                      <AccountCircleIcon  />
                    </IconButton>
                  </Link>
                </NextLink>)
              }
              <Switch checked={darkMode} onChange={changeDarkModeHandler} color="secondary"></Switch>
            </Box>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={classes.main}>{children}</Container>
        <Box component="footer" sx={classes.footer}>
          <Typography variant="subtitle2">© 2023 RelayMart. All Rights Reserved.</Typography>
        </Box>
      </ThemeProvider>
    </>
  )
}
