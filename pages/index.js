import Head from 'next/head';
import { Typography } from '@mui/material';

export default function Home() {
  return (
    <>
      <Head>
        <title>Relay Ecommerce</title>
        <meta name="description" 
          content="The ecommerce website served by robots to assist customers with their shopping experience." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Typography component="h1" variant="h1">Relay Ecommerce</Typography>
    </>
  );
}
