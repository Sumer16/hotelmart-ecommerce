import { useContext, useEffect, useReducer } from 'react'

import NextLink from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

import { useSnackbar } from 'notistack';
import axios from 'axios';

import { 
  Alert, 
  Box, 
  Button, 
  Card, 
  CircularProgress, 
  Divider, 
  Grid, 
  Link, 
  List, 
  ListItem, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
} from '@mui/material';

import Layout from '../../components/Layout';

import classes from '../../utils/classes';
import { Store } from '../../utils/Store';
import { getError } from '../../utils/error';
import getStripe from '../../utils/getStripe';

// Accept state and action & check action type
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
  }
}

function OrderScreen({ params }) {
  const { id: orderId } = params;

  const { state } = useContext(Store);

  const { userInfo } = state;

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [
    {loading, error, order, successPay },
    dispatch,
  ] = useReducer(reducer, { loading: true, order: {}, error: '', });

  const {
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  const [ { isPending }, paypalDispatch ] = usePayPalScriptReducer();

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }

    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!order._id || successPay ||  (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}`},
        });

        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      }
      loadPaypalScript();
    }
  }, [orderId, router, userInfo, successPay, order, paypalDispatch]);

  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: totalPrice },
        },
      ],
    }).then((orderID) => {
      return orderID;
    });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST'});
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { 
              authorization: `Bearer ${userInfo.token}`
            },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        enqueueSnackbar('Order is paid!', { variant: 'success' });
        router.push('/success');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    })
  }

  function onError(err) {
    enqueueSnackbar(getError(err), { variant: 'error' });
  }

  const handleStripePayment = async () => {
    const stripe = await getStripe();

    const response = await fetch('/api/stripe',
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(orderItems),
    });

    if (response.statusCode === 500) return;

    const data = await response.json();

    stripe.redirectToCheckout({ sessionId: data.id });
  }

  return (
    <Layout title={`Order ${orderId} | HotelMart`}>
      <Typography component="h1" variant="h1" sx={{ overflowWrap: 'break-word' }}>
        Order ID: {orderId}
      </Typography>

      {loading ? (<CircularProgress />)
        : error ? (<Alert variant="error">{error}</Alert>)
        : (<Grid container spacing={2}>
            <Grid item md={9} xs={12}>
              <Card sx={classes.section}>
                <List>
                  <ListItem>
                    <Typography component="h5" variant="h5" fontWeight={500}>
                      Delivery Details
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="subtitle1">
                      Last Name: {userInfo.lastName}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant="subtitle1">
                      Room Number: {userInfo.roomNumber}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    Status: {' '}
                    {isDelivered ? 
                      `Delivered at ${deliveredAt}` : 
                      'Delivery in progress'}
                  </ListItem>
                </List>
              </Card>
              <Card sx={classes.section}>
                <List>
                  <ListItem>
                    <Typography component="h5" variant="h5" fontWeight={500}>
                      Payment Method
                    </Typography>
                  </ListItem>
                  <ListItem>
                    {paymentMethod}
                  </ListItem>
                  <ListItem>
                    Status: {' '}
                    {isPaid ?
                      `Paid at ${paidAt}` : 
                      'Not paid yet'}
                  </ListItem>
                </List>
              </Card>
              <Card sx={classes.section}>
                <List>
                  <ListItem>
                    <Typography component="h5" variant="h5" fontWeight={500}>
                      Order Items
                    </Typography>
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
                          {orderItems.map((item) => (
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
                          Subtotal 
                          <Typography variant="caption">({orderItems.reduce((a, c) => a + c.quantity, 0)} {orderItems.reduce((a, c) => a + c.quantity, 0) > 1 ? 'items' : 'item'})</Typography>
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
                  {
                    !isPaid && (
                      <ListItem>
                        {
                          isPending ? (
                            <CircularProgress />
                          ) : (
                            <Box sx={classes.fullWidth}>
                              {paymentMethod === 'PayPal' ? (
                              <PayPalButtons
                                createOrder={createOrder}
                                onApprove={onApprove}
                                onError={onError}
                              ></PayPalButtons>) 
                              : paymentMethod === 'Stripe' ? (
                              <Button
                                onClick={handleStripePayment}
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                              >
                                Pay with Stripe 
                                {
                                  loading && 
                                  (<CircularProgress 
                                    size='1.5rem' 
                                    sx={{ marginLeft: '4px' }} 
                                  />)
                                }
                              </Button>) : ''}
                            </Box>
                          )
                        }
                      </ListItem>
                    )
                  }
                </List>
              </Card>
            </Grid>
        </Grid>)}
    </Layout>
  );
}

export function getServerSideProps ({ params }) {
  return {
    props: {
      params
    }
  };
}

// Render only in client side
export default dynamic(() => Promise.resolve(OrderScreen), { ssr: false });
