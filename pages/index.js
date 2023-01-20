import { useEffect, useState } from 'react';

import { Alert, CircularProgress, Grid, Typography } from '@mui/material';

import Layout from '../components/Layout';

import client from '../utils/client';
import ProductItem from '../components/ProductItem';

export default function Home() {

  const [state, setState] = useState({
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

  return <Layout>
    {loading ? (<CircularProgress />) 
      : error ? (<Alert variant="danger">{error}</Alert>) 
      : (<Grid container spacing={3}>
        {products.map((product, index) => (
          <Grid item md={4} key={index}>
            <ProductItem product={product}></ProductItem>
          </Grid>
        ))}
        </Grid>)
    }
    </Layout>;
}
