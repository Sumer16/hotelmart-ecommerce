import { useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useSnackbar } from 'notistack';

import { Alert, CircularProgress, Grid } from '@mui/material';

import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';

import client from '../utils/client';
import { Store } from '../utils/Store';
import { urlForThumbnail } from '../utils/image';

export default function Home() {
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);
  
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [ state, setState ] = useState({
    products: [],
    error: '',
    loading: true,
  });

  const { loading, error, products } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        /* https://sanity.io/docs/how-queries-work */
        const products = await client.fetch(`*[_type == "product"]`); // Sanity Client
        setState({products, loading: false});
      } catch (err) {
        setState({loading: false, error: err.message});
      }
    };
    fetchData();
  }, []);

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((item) => item._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    // const { data } = await axios.get(`/api/products/${product._id}`);
    
    if (product.countInStock < quantity) {
      enqueueSnackbar("Sorry, this product is out of stock", { variant: 'error' });
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        _key: product._id,
        name: product.name,
        countInStock: product.countInStock,
        slug: product.slug.current,
        price: product.price,
        image: urlForThumbnail(product.image),
        quantity,
      },
    });
    enqueueSnackbar(`${product.name} added to the cart`, {
      variant: 'success',
    });
    router.push('/cart');
  };

  return <Layout>
    {loading ? (<CircularProgress />) 
      : error ? (<Alert variant="danger">{error}</Alert>) 
      : (<Grid container justifyContent="space-evenly" spacing={3}>
        {products.map((product) => (
          <Grid item md={4} key={product._id}>
            <ProductItem 
              product={product} 
              addToCartHandler={addToCartHandler}
            ></ProductItem>
          </Grid>
        ))}
        </Grid>)
    }
    </Layout>;
}
