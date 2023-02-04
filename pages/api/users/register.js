import nextConnect from 'next-connect';
import bcrypt from 'bcryptjs';
import axios from 'axios';

import config from '../../../utils/config';
import { signToken } from '../../../utils/auth';
import client from '../../../utils/client';

const handler = nextConnect();

handler.post(async (req, res) => {
  const projectId = config.projectId;
  const dataset = config.dataset;
  const apiVersion = config.apiVersion;
  const tokenWithWriteAccess = process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN;
  
  // update data in sanity
  const createMutations = [
    {
      create: {
        _type: 'user',
        lastName: req.body.lastName,
        roomNumber: req.body.roomNumber,
        password: bcrypt.hashSync(req.body.password),
        isAdmin: false,
      },
    },
  ];

  // To check if there is an existing user present or not
  const existUser = await client.fetch(`*[_type == "user" && roomNumber == $roomNumber][0]`, { 
    roomNumber: req.body.roomNumber,
  });

  if (existUser) {
    // 401 - client side authentication has failed
    return res.status(401).send({ message: 'Room number is already registered' });
  }

  // POST our data on to Sanity
  const { data } = await axios.post(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}?returnIds=true`,
    { 
      mutations: createMutations
    },
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${tokenWithWriteAccess}`,
      },
    }
  );

  // data that we get from user registration input fields
  const userId = data.results[0].id;
  const user = {
    _id: userId,
    lastName: req.body.lastName,
    roomNumber: req.body.roomNumber,
    isAdmin: false,
  };

  // sign it with Sanity generated token
  const token = signToken(user);
  res.send({ ...user, token });
});

export default handler;
