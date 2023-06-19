import nc from 'next-connect';

import { isAuth } from '../../../utils/auth';

const handler = nc();
handler(isAuth);

handler.get(async (req, res) => {
  // sb stands for sandbox
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

export default handler;
