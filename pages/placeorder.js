import { useContext, useEffect, useState } from 'react'

import NextLink from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { useSnackbar } from 'notistack';
import axios from 'axios';
import jsCookies from 'js-cookie';

import { 
  Button, 
  Card, 
  Grid, 
  List,
  Link,
  ListItem, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  CircularProgress,
  Divider
} from '@mui/material';

import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';

import classes from '../utils/classes';
import { Store } from '../utils/Store';
import { getError } from '../utils/error';

function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store);

  const { 
    userInfo, 
    cart: { cartItems, paymentMethod },
  } = state;

  console.log(cartItems);

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(cartItems.reduce((acc, c) => acc + c.price * c.quantity, 0));
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + taxPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, paymentMethod, router]);

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems.map((item) => ({
            ...item,
            countInStock: undefined,
            slug: undefined,
          })),
          paymentMethod,
          itemsPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      dispatch({ type: 'CART_CLEAR' });
      jsCookies.remove('cartItems');
      
      setLoading(false);
      
      router.push(`/order/${data}`);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  }

  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={2}></CheckoutWizard>
      <Typography component="h4" variant="h4">
        Place Order
      </Typography>
      <Grid container spacing={2}>
        <Grid item md={9} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h5" variant="h5">
                  Delivery Details
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  Last Name: {userInfo.lastName}
                </Typography>
                <Typography>
                  Room Number: {userInfo.roomNumber}
                </Typography>
              </ListItem>
            </List>
          </Card>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={8} textAlign="left">
                    <Typography component="h5" variant="h5">
                      Payment Method
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Button
                      onClick={() => router.push('/payment')}
                      variant="contained"
                      color="secondary"
                    >
                      Edit
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                {paymentMethod}
              </ListItem>
            </List>
          </Card>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={8} textAlign="left">
                    <Typography component="h5" variant="h5">
                      Order Items
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Button
                      onClick={() => router.push('/cart')}
                      variant="contained"
                      color="secondary"
                    >
                      Edit
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item._key}>
                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                ></Image>
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
                          <TableCell align="right">
                            <Typography>{item.quantity}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>${item.price}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h5" fontWeight="bold">Order Summary</Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={8}>
                    <Typography variant="subtitle1">
                      Subtotal <Typography variant="caption">({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}items)</Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography align="right">${itemsPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={8} align="left">
                    <Typography variant="subtitle1">
                      Delivery
                    </Typography>
                  </Grid>
                  <Grid item xs={4} align="right">
                    <Typography variant="subtitle1">
                      Free
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={8} align="left">
                    <Typography variant="subtitle1">
                      Estimated Tax
                    </Typography>
                  </Grid>
                  <Grid item xs={4} align="right">
                    <Typography variant="subtitle1">
                      ${taxPrice}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />
              <ListItem>
                <Grid container>
                  <Grid item xs={8}>
                    <Typography variant="h6" textAlign="left">
                      <strong>Total</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="h6">
                      <strong>${totalPrice}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />
              <ListItem>
                <Button
                  onClick={placeOrderHandler}
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  Place Order
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

// Render only in client side
export default dynamic(() => Promise.resolve(PlaceOrderScreen), { ssr: false });
