import { useContext, useEffect, useState } from 'react';

import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { useSnackbar } from 'notistack';
import axios from 'axios';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Link,
  ListItem,
  Typography,
  List,
  Breadcrumbs,
  Chip
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import Layout from '../../components/Layout';

import client from '../../utils/client';
import classes from '../../utils/classes';
import { urlFor, urlForThumbnail } from '../../utils/image';
import { Store } from '../../utils/Store';

export default function ProductScreen(props) {
  const {
    state: { cart },
    dispatch
  } = useContext(Store);
 
  const { slug } = props;
  
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [ state, setState ] = useState({
    product: null, // from sanity
    loading: true,
    error: '',
  });

  const { product, loading, error } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Anything after /product/ goes in $slug.
        // [0] means the product's url when clicked, we are not receiving an array of product so doesn't matter
        const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug });
        setState({ ...state, product, loading: false })
      } catch (err) {
        setState({ ...state, error: err.message, loading: false })
      }
    };
    fetchData();
  }, []);

  const addToCartHandler = async () => {
    // Check for existing item
    const existItem = cart.cartItems.find((item) => item._id === product._id);
    // If user selected same instance of a product and add to cart we check if they are different
    // If not different we add one by default
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (product.countInStock < quantity) {
      enqueueSnackbar("Sorry, this product is out of stock", { variant: 'error' });
      return;
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        _key: product._id,
        name: product.name,
        slug: product.slug.current, // Since we want text not slug object
        price: product.price,
        countInStock: product.countInStock,
        image: urlForThumbnail(product.image),
        quantity,
      },
    });

    enqueueSnackbar(`${product.name} added to the cart`, { variant: 'success' });

    router.push('/cart')
  }

  return (
    // If product is null, don't give an error just use null
    <Layout title={product?.title}>
      {loading ? (<CircularProgress />)
        : error ? (<Alert variant="error">{error}</Alert>)
        : (<Box>
          <Box sx={classes.section}>
            <Breadcrumbs>
              <NextLink href="/" passHref>
                <Link underline="hover" sx={{ display: 'flex', alignItems: 'center' }}>
                  <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  <Typography>Home</Typography>
                </Link>
              </NextLink>
              <Typography>{product.name}</Typography>
            </Breadcrumbs>
          </Box>
          <Grid container spacing={1}>
            <Grid item md={6} xs={12}>
              <Image
                src={urlFor(product.image)}
                alt={product.name}
                layout="responsive"
                width={640}
                height={640}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    {product.name}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="subtitle2">by {product.brand}</Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="body1">About this Item: {product.description}</Typography>
                </ListItem>
                <ListItem>
                  <Typography sx={{ paddingRight: '7px' }}>Category:</Typography>
                  <Chip label={product.category} color="success" variant="outlined" />
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography component={'span'}>Price: ${product.price}</Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography component={'span'}>
                      {product.countInStock > 0 ?
                        (<Typography sx={{ fontWeight: 'bold', color: 'green' }}>In stock</Typography>)
                        : (<Typography sx={{ fontWeight: 'bold', color: 'red' }}>Unavailable</Typography>)}
                    </Typography>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid item xs={12} md={12}>
                    <Button onClick={addToCartHandler} fullWidth variant="contained">
                      Add To Cart <AddShoppingCartIcon />
                    </Button>
                  </Grid>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Box>)
      }
    </Layout>
  );
}

/* Why I used component={span} in Typography:
https://stackoverflow.com/questions/41928567/div-cannot-appear-as-a-descendant-of-p */

export function getServerSideProps(context) {
  return {
    props: { 
      slug: context.params.slug 
    },
  };
}