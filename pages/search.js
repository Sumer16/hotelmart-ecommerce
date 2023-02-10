import { useContext, useState, useEffect } from 'react'

import { useRouter } from 'next/router';

import { useSnackbar } from 'notistack';
import axios from 'axios';

import { 
  Box,
  Button,
  CircularProgress,
  Grid, 
  List, 
  ListItem, 
  MenuItem, 
  Select, 
  Typography 
} from '@mui/material';

import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';

import classes from '../utils/classes';
import { Store } from '../utils/Store';
import { urlForThumbnail } from '../utils/image';
import client from '../utils/client';

const prices = [
  {
    name: '$1 to $4.99',
    value: '1-4.99',
  },
  {
    name: '$5 to $10.99',
    value: '5-10.99',
  },
  {
    name: '$11 to $100',
    value: '11-100',
  },
];

export default function SearchScreen() {
  const [state, setState] = useState({
    categories: [],
    products: [],
    error: '',
    loading: true,
  });

  const {
    state: { cart },
    dispatch,
  } = useContext(Store);

  const { loading, products, error } = state;

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [categories, setCategories] = useState([]);

  const {
    category = 'all',
    query = 'all',
    price = 'all',
    sort = 'default',
  } = router.query;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchCategories();

    const fetchData = async () => {
      try {
        let gQuery = '*[_type == "product"';

        if (category !== 'all') {
          gQuery += ` && category match "${category}" `;
        }

        if (query !== 'all') {
          gQuery += ` && name match "${query}" `;
        }

        if (price !== 'all') {
          const minPrice = Number(price.split('-')[0]);
          const maxPrice = Number(price.split('-')[1]);
          gQuery += ` && price >= ${minPrice} && price <= ${maxPrice}`;
        }

        let order = '';
        if (sort !== 'default') {
          if (sort === 'lowest') order = '| order(price asc)';
          if (sort === 'highest') order = '| order(price desc)';
        }
        gQuery += `] ${order}`;

        setState({ loading: true });

        const products = await client.fetch(gQuery);

        setState({ products, loading: false });
      } catch (err) {
        setState({ error: err.message, loading: false });
      }
    };
    fetchData();
  }, [category, price, query, sort]);

  const filterSearch = ({ category, sort, searchQuery, price }) => {
    const path = router.pathname;
    const { query } = router;
    if (searchQuery) query.searchQuery = searchQuery;
    if (category) query.category = category;
    if (sort) query.sort = sort;
    if (price) query.price = price;

    router.push({
      pathname: path,
      query: query,
    });
  };

  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };

  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };

  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };

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

  return (
    <Layout title="Search">
      <Grid sx={classes.section} container spacing={2}>
        <Grid item md={3}>
          <List>
            <ListItem>
              <Box sx={classes.fullWidth}>
                <Typography>Categories</Typography>
                <Select fullWidth value={category} onChange={categoryHandler}>
                  <MenuItem value="all">All</MenuItem>
                  {categories &&
                    categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box sx={classes.fullWidth}>
                <Typography>Prices</Typography>
                <Select value={price} onChange={priceHandler} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {prices.map((price) => (
                    <MenuItem key={price.value} value={price.value}>
                      {price.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={9}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              {products && products.length !== 0 ? products.length : 'No'}{' '}
              Results
              {query !== 'all' && query !== '' && ' : ' + query}
              {price !== 'all' && ' : Price ' + price}
              {(query !== 'all' && query !== '') ||
              price !== 'all' ? (
                <Button onClick={() => router.push('/search')}>X</Button>
              ) : null}
            </Grid>
            <Grid item>
              <Typography component="span" sx={classes.sort}>
                Sort by
              </Typography>
              <Select value={sort} onChange={sortHandler}>
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="lowest">Price: Low to High</MenuItem>
                <MenuItem value="highest">Price: High to Low</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Grid sx={classes.section} container spacing={2}>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert>{error}</Alert>
            ) : (
              <Grid sx={classes.searchSectionFlex} container spacing={3}>
                {products.map((product) => (
                  <Grid item key={product.name}>
                    <ProductItem
                      product={product}
                      addToCartHandler={addToCartHandler}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  )
}
