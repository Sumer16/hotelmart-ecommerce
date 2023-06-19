import { useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useSnackbar } from 'notistack';
import jsCookies from 'js-cookie';

import { 
  Button, 
  FormControl, 
  FormControlLabel, 
  List, 
  ListItem, 
  Radio, 
  RadioGroup, 
  Typography 
} from '@mui/material';

import CheckoutWizard from '../components/CheckoutWizard';
import Form from '../components/Form';
import Layout from '../components/Layout';

import { Store } from '../utils/Store';

export default function PaymentScreen() {
  const { state, dispatch } = useContext(Store);

  const [ paymentMethod, setPaymentMethod ] = useState('');

  const { userInfo } = state;

  console.log(userInfo);

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login?redirect=/payment');
    } else {
      setPaymentMethod(jsCookies.get('paymentMethod') || '');
    }
  }, [router, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      enqueueSnackbar('Please select a payment method', { variant: 'error' });
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      jsCookies.set('paymentMethod', paymentMethod);
      
      router.push('/placeorder');
    }
  }

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={1}></CheckoutWizard>
      <Form onSubmit={submitHandler}>
        <Typography variant="h4" component="h4">
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Payment Method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="Stripe"
                  value="Stripe"
                  control={<Radio />}
                />
                <FormControlLabel
                  label="PayPal"
                  value="PayPal"
                  control={<Radio />}
                />
                <FormControlLabel
                  label="Cash (pay at reception)"
                  value="Cash"
                  control={<Radio />}
                />
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              type="button"
              variant="contained"
              color="secondary"
              onClick={() => router.push('/cart')}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </Form>
    </Layout>
  )
}
