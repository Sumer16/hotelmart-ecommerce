import { useEffect } from 'react';

import NextLink from 'next/link';

import { 
  Box,
  Button,
  CardActions,
  CardContent,
  Link,
  Paper,
  Typography
} from '@mui/material';

import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

import Layout from '../components/Layout';

import classes from '../utils/classes';
import { runFireworks } from '../utils/confetti';

const Success = () => {
  
  useEffect(() => {
    runFireworks();
  }, []);

  return (
    <Layout title="Successful Order">
      <Box sx={classes.success}>
        <Paper elevation={6} sx={classes.successCard}>
          <CardContent>
            <ShoppingBagOutlinedIcon sx={{ fontSize: 60 }} color="success" />
            <Typography variant="h1" component="div" sx={{ fontWeight: "bold" }}>
              Thank You For Ordering!
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              For the status of your payment, please check your order history or your mail inbox.
            </Typography>
            <Typography variant="body2">
              If you have any questions, please email to {' '} <br />
              <Link href="mailto:order@hotelmart.com" rel="noopener" target="_blank">
                orders@hotelmart.com
              </Link>
            </Typography>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "center" }}>
            <NextLink href="/" passHref>
              <Link>
                <Button sx={{ marginBottom: '5px' }} size="large" variant="contained" color="secondary">Continue Shopping</Button>
              </Link>
            </NextLink>
          </CardActions>
        </Paper>
      </Box>
    </Layout>
  )
}

export default Success;
