import nextConnect from 'next-connect';
import bcrypt from 'bcryptjs';

import { signToken } from '../../../utils/auth';
import client from '../../../utils/client';

const handler = nextConnect();

handler.post(async (req, res) => {
  const user = await client.fetch(`*[_type == "user" && roomNumber == $roomNumber][0]`, { 
    roomNumber: req.body.roomNumber,
  });

  // compareSync allows you to check if typed password & sanity saved password is same or not
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken({
      _id: user._id,
      lastName: user.lastName,
      roomNumber: user.roomNumber,
      isAdmin: user.isAdmin,
    });

    res.send({
      _id: user._id,
      lastName: user.lastName,
      roomNumber: user.roomNumber,
      isAdmin: user.isAdmin,
      token,
    });
  } else {
    // 401 - client side authentication has failed
    res.status(401).send({ message: 'Invalid room number or password' });
  }
});

export default handler;
