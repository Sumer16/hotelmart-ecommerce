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

import RegisterIcon from '@mui/icons-material/HowToReg';

import Layout from '../components/Layout';
import Form from '../components/Form';

import { Store } from '../utils/Store';

export default function RegisterScreen() {
  const { state, dispatch } = useContext(Store);

  const { userInfo } = state;

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, [router, userInfo]);

  const { 
    handleSubmit, 
    control, 
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ lastName, roomNumber, password, confirmPassword }) => {
    if(password !== confirmPassword) {
      enqueueSnackbar("Passwords don't match", { variant: 'error' });
      return;
    }

    try {
      const { data } = await axios.post('/api/users/register', {
        lastName, 
        roomNumber, 
        password,
      });

      dispatch({ type: 'USER_LOGIN', payload: data });
      jsCookies.set('userInfo', JSON.stringify(data));

      router.push('/');
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  }

  return (
    <Layout title="Register">
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography component="h1" variant="h1">
          Register
        </Typography>
        <List>
          <ListItem>
            <Controller 
              name="lastName" 
              control={control} 
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  inputProps={{ type: 'name' }}
                  error={Boolean(errors.name)}
                  helperText={errors.name ? 
                    errors.lastName.type === 'minLength' ? 
                      'Last Name length should be min 1 character' : 'Last Name is required' 
                    : ''}
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
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
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', type: 'number' }}
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
            <Controller 
              name="confirmPassword" 
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
                  id="confirmPassword"
                  label="Confirm Password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword ? 
                    errors.confirmPassword.type === 'minLength' ? 
                      'Confirmed Password should match Password' : 'Confirming Password is required' 
                    : ''}
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Register <RegisterIcon />
            </Button>
          </ListItem>
          <ListItem sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <Typography marginRight={1}>Already have an account?</Typography>
            <NextLink href={'/login'} passHref>
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </Form>
    </Layout>
  );
}
