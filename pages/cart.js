import { useContext } from 'react';

import NextLink from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

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

  console.log(cartItems);

  const { enqueueSnackbar } = useSnackbar();

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);

    if (data.countInStock < quantity) {
      enqueueSnackbar('Sorry, at this moment this product is out of stock', { variant: 'error' });
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
        (<Grid container spacing={1}>
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
                  <Grid container>
                    <Grid item xs={8} textAlign="left">
                      <Typography variant="subtitle1">
                        Subtotal <Typography variant="caption">({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}items)</Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={4} textAlign="right">
                      <Typography variant="subtitle1">
                        ${cartItems.reduce((a, c) => a + c.quantity * c.price, 0).toFixed(2)}
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
                        $0
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <Divider />
                <ListItem>
                  <Grid container>
                    <Grid item xs={6} textAlign="left">
                      <Typography variant="h6">
                        Total
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="h6">
                        ${cartItems.reduce((a, c) => a + c.quantity * c.price, 0).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <Divider />
                <ListItem>
                  <Button fullWidth color="primary" variant="contained">Checkout</Button>
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