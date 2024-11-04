import { useContext, useEffect, useState } from 'react';

import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { useSnackbar } from 'notistack';
import jsCookies from 'js-cookie';
import axios from 'axios';

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
  Fade,
  Menu,
  MenuItem,
  ThemeProvider,
  List,
  ListItem,
  Drawer,
  useMediaQuery,
  ListItemText,
  InputBase,
  Divider,
  Grid,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';

import classes from '../utils/classes';
import { Store } from '../utils/Store';
import { getError } from '../utils/error';

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

  const changeDarkModeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const enableDarkMode = !darkMode;
    jsCookies.set('darkMode', enableDarkMode ? 'ON' : 'OFF');
  }

  const open = Boolean(anchorEl);

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

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };

  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const [categories, setCategories] = useState([]);

  const [query, setQuery] = useState('');

  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    };
    fetchCategories();
  }, [enqueueSnackbar]);

  const isDesktop = useMediaQuery('(min-width:750px)');

  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {title ? `${title} | HotelMart` : 'HotelMart'}
        </title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" sx={classes.appbar}>
          <Toolbar sx={classes.toolbar}>
            <Grid sx={isDesktop ? classes.gridAppBar : classes.gridAppBarMobile} container spacing={1} marginTop={1} marginBottom={1}>
              <Box sx={{ gridArea: 'brand', display: 'flex', alignItems: 'center' }}>
                <IconButton
                  edge="start"
                  aria-label="open drawer"
                  onClick={sidebarOpenHandler}
                >
                  <MenuIcon sx={classes.navbarButton} />
                </IconButton>
                <NextLink href="/" passHref>
                  <Link>
                    <Typography sx={classes.brand}>HotelMart</Typography>
                  </Link>
                </NextLink>
              </Box>
              <Drawer
                anchor="left"
                open={sidebarVisible}
                onClose={sidebarCloseHandler}
              >
                <List sx={{ padding: 0 }}>
                  <Box sx={{ backgroundColor: '#203040'}}>
                  <ListItem sx={{ display:'flex', justifyContent: 'flex-end'}}>
                    <IconButton
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                      sx={{ color: '#ffffff' }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </ListItem>
                  <ListItem>
                    <Box>
                      <Typography sx={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '600' }}>Browse</Typography>
                      <NextLink href="/" passHref>
                        <Link>
                          <Typography variant="h6">HotelMart</Typography>
                        </Link>
                      </NextLink>
                    </Box>
                  </ListItem>
                  </Box>
                  <Divider />
                  <ListItem>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h2">Shop By Category</Typography>
                    </Box>
                  </ListItem>
                  {categories.map((category) => (
                    <NextLink
                      key={category}
                      href={`/search?category=${category}`}
                      passHref
                    >
                      <ListItem
                        button
                        component="a"
                        onClick={sidebarCloseHandler}
                      >
                        <ListItemText primary={category}></ListItemText>
                      </ListItem>
                    </NextLink>
                  ))}
                </List>
              </Drawer>
              <Box sx={{ gridArea: 'search' }}>
                <form onSubmit={submitHandler}>
                  <Box sx={classes.searchForm}>
                    <InputBase
                      name="query"
                      sx={classes.searchInput}
                      placeholder="Search products"
                      onChange={queryChangeHandler}
                      fullWidth
                    />
                    <IconButton
                      type="submit"
                      sx={classes.searchButton}
                      aria-label="search"
                    >
                      <SearchIcon />
                    </IconButton>
                  </Box>
                </form>
              </Box>
              <Box sx={{ gridArea: 'icons', justifySelf: 'end' }} display="flex" flexWrap="wrap-reverse" justifyContent="center">
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
                    <IconButton
                      id="fade-button"
                      aria-controls={open ? 'fade-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={loginMenuClickHandler}
                      sx={classes.appBarButton}
                    >
                      <AccountCircleIcon  />
                    </IconButton>
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
                      <MenuItem>
                        <Typography sx={{ marginLeft: '2px' }} variant="body1">
                          Hi, {userInfo.lastName}
                        </Typography>
                      </MenuItem>
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, '/order-history')
                        }
                      >
                        Order History
                      </MenuItem>
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
            </Grid>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={classes.main}>{children}</Container>
        <Box component="footer" sx={classes.footer}>
          <Typography variant="subtitle2">© 2024 HotelMart. All Rights Reserved.</Typography>
        </Box>
      </ThemeProvider>
    </>
  )
}
