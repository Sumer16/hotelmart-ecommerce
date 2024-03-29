import { useContext, useEffect } from 'react';

import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import jsCookies from 'js-cookie';

import { 
  Button, 
  Link, 
  List, 
  ListItem, 
  TextField, 
  Typography 
} from '@mui/material';

import LoginIcon from '@mui/icons-material/Login';

import Layout from '../components/Layout';
import Form from '../components/Form';

import { Store } from '../utils/Store';
import { getError } from '../utils/error';

export default function LoginScreen() {
  const { state, dispatch } = useContext(Store);

  const { userInfo } = state;

  const router = useRouter();
  const { redirect } = router.query;

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (userInfo) {
      router.push(redirect || '/'); // push the user info onto the main screen
    }
  }, [router, userInfo, redirect]);

  const { 
    handleSubmit, 
    control, 
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ roomNumber, password }) => {
    try {
      const { data } = await axios.post('/api/users/login', {
        roomNumber, 
        password,
      });

      dispatch({ type: 'USER_LOGIN', payload: data });
      jsCookies.set('userInfo', JSON.stringify(data));

      router.push(redirect || '/');
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  }

  return (
    <Layout title="Login">
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
          <ListItem>
            <Controller 
              name="roomNumber" 
              control={control} 
              defaultValue=""
              rules={{
                required: true,
                pattern: /[0-9]*/,
                maxLength: 3,
                minLength: 3
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="roomNumber"
                  label="Room Number"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', type:'number' }}
                  error={Boolean(errors.roomNumber)}
                  helperText={errors.roomNumber ? 
                    ((errors.roomNumber.type === 'maxLength') || (errors.roomNumber.type === 'minLength')) ?
                      'Room Number is not valid' : 'Room Number is required' 
                    : ''}
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller 
              name="password" 
              control={control} 
              defaultValue=""
              rules={{
                required: true,
                minLength: 6
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={errors.password ? 
                    errors.password.type === 'minLength' ? 
                      'Password should be min 6 characters' : 'Password is required' 
                    : ''}
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Login <LoginIcon />
            </Button>
          </ListItem>
          <ListItem sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <Typography marginRight={1}>Don&apos;t have an account?</Typography>
            <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
              <Link>Create an account</Link>
            </NextLink>
          </ListItem>
        </List>
      </Form>
    </Layout>
  );
}
