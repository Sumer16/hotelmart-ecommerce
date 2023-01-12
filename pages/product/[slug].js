import { useEffect, useState } from 'react';

import NextLink from 'next/link';
import Image from 'next/image';

import { 
  Alert, 
  Box, 
  Button, 
  Card, 
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
import { urlFor } from '../../utils/image';

export default function ProductScreen(props) {
    const { slug } = props;
    
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
                const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, {slug});
                setState({ ...state, product, loading: false })
            } catch(err) {
                setState({ ...state, error: err.message, loading: false })
            }
        };
        fetchData();
    }, [setState, slug, state]);

    return (
        // If product is null, don't give an error just use null
        <Layout title={product?.title}>
            {loading? (<CircularProgress />)
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
                        <Typography sx={classes.brandName}>by {product.brand}</Typography>
                      </ListItem>
                      <ListItem>
                        <Typography>About this Item: {product.description}</Typography>
                      </ListItem>
                      <ListItem>
                        <Typography sx={{ paddingRight: '7px' }}>Category:</Typography>
                        <Chip label={product.category} color="success" variant="outlined" />
                      </ListItem>
                      <ListItem>
                          <Grid container>
                            <Grid item xs={6}>
                              <Typography>${product.price}</Typography>
                            </Grid>
                          </Grid>
                          <Grid item xs={6}>
                              <Typography>
                                {product.countInStock > 0 ? 
                                  (<Typography sx={{ fontWeight: 'bold', color: 'green' }}>In stock</Typography>)
                                : (<Typography sx={{ fontWeight: 'bold', color: 'red' }}>Unavailable</Typography>)}
                              </Typography>
                            </Grid>
                        </ListItem>
                        <ListItem>
                          <Grid item xs={12} md={6}>
                            <Button fullWidth variant='contained'>
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

export function getServerSideProps(context) {
    return {
        props: { slug: context.params.slug },
    };
}