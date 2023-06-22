import { useContext, useEffect, useReducer } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import axios from 'axios';

import {
  Alert,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import Layout from '../components/Layout';

import { getError } from '../utils/error';
import { Store } from '../utils/Store';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function OrderHistoryScreen() {

  const { state } = useContext(Store);
  const { userInfo } = state;

  const router = useRouter();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    if(!userInfo) {
      router.push('/login');
    }

    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}`}
        })

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    }
    fetchOrders();
  }, [router, userInfo]);

  return (
    <Layout title="Order History">
      <Typography component="h1" variant="h1">
        Order History
      </Typography>
      {loading ? (<CircularProgress />) 
      : error ? (<Alert variant="danger">{error}</Alert>) 
      : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.createdAt}</TableCell>
                  <TableCell>${order.totalPrice}</TableCell>
                  <TableCell>
                    {order.isPaid ? `Paid at ${order.paidAt}` : 'Not paid yet'}
                  </TableCell>
                  <TableCell>
                    <NextLink href={`/order/${order._id}`} passHref>
                      <Button variant="contained">Details</Button>
                    </NextLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Layout>
  );
}

// Render only in client side
export default dynamic(() => Promise.resolve(OrderHistoryScreen), { ssr: false });
