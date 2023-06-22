import nextConnect from 'next-connect';

import { isAuth } from '../../../utils/auth';

const handler = nextConnect();
handler(isAuth);

handler.get(async (req, res) => {
  // sb stands for sandbox
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

export default handler;
