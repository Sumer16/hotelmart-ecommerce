import { useContext } from 'react';

import NextLink from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { useSnackbar } from 'notistack';
import axios from 'axios';

import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

import Layout from '../components/Layout';

import { Store } from '../utils/Store';

function CartScreen() {
  const {
    state: {
      cart: { cartItems }
    },
    dispatch,
  } = useContext(Store);

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(cartItems.reduce((acc, c) => acc + c.price * c.quantity, 0));
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + taxPrice);

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);

    if (data.countInStock < quantity) {
      enqueueSnackbar("Sorry, this product is out of stock", { variant: 'error' });
      return;
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        _key: item._key,
        name: item.name,
        slug: item.slug, // Since we want text not slug object
        price: item.price,
        countInStock: item.countInStock,
        image: item.image,
        quantity,
      },
    });

    enqueueSnackbar(`${item.name} updated in the cart`, { variant: 'success' });
  };

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    enqueueSnackbar(`${item.name} removed from the cart`, { variant: 'success' });
  };

  return (
    <Layout title="Cart">
      <Typography component="h4" variant="h4">
        Shopping Cart
      </Typography>
      {cartItems.length === 0 ?
        (<Box>
          <Typography>Cart is empty.{' '}
            <NextLink href="/" passHref>
              <Link>Go shopping</Link>
            </NextLink>
          </Typography>
        </Box>) :
        (<Grid container spacing={3}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item._key}>
                      <TableCell component="th" scope="item">
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            />
                          </Link>
                        </NextLink>
                      </TableCell>
                      <TableCell>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Typography>{item.name}</Typography>
                          </Link>
                        </NextLink>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={item.quantity} 
                          onChange={(e) => updateCartHandler(item, e.target.value)}
                        >
                          {[...Array(item.countInStock).keys()].map((item) => (
                            <MenuItem key={item + 1} value={item + 1}>
                              {item + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>${item.price}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          color="secondary"
                          aria-label="delete"
                          onClick={() => removeItemHandler(item)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h5" fontWeight="bold">Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={8} textAlign="left">
                      <Typography variant="subtitle1">
                        Subtotal <Typography variant="caption">({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}items)</Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={4} textAlign="right">
                      <Typography variant="subtitle1">
                        ${itemsPrice}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={8} textAlign="left">
                      <Typography variant="subtitle1">
                        Delivery
                      </Typography>
                    </Grid>
                    <Grid item xs={4} textAlign="right">
                      <Typography variant="subtitle1">
                        Free
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6} textAlign="left">
                      <Typography variant="subtitle1">
                        Estimated Tax
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="subtitle1">
                        ${taxPrice}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <Divider />
                <ListItem>
                  <Grid container>
                    <Grid item xs={6} textAlign="left">
                      <Typography variant="h6">
                        <strong>Total</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="h6">
                        <strong>${totalPrice}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <Divider />
                <ListItem>
                  <Button 
                    onClick={() => {
                      router.push('/payment')
                    }} 
                    fullWidth 
                    color="primary" 
                    variant="contained"
                  >
                    Checkout
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>)
      }
    </Layout>
  )
}

// Since it is dynamic and loading on client rather than server
export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
