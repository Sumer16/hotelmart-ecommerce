import nextConnect from 'next-connect';
import bcrypt from 'bcryptjs';
import axios from 'axios';

import config from '../../../utils/config';
import { signToken } from '../../../utils/auth';

const handler = nextConnect();

handler.post(async (req, res) => {
  const projectId = config.projectId;
  const dataset = config.dataset;
  const apiVersion = config.apiVersion;
  const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
  
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

  const userId = data.results[0].id;
  const user = {
    _id: userId,
    lastName: req.body.lastName,
    roomNumber: req.body.roomNumber,
    isAdmin: false,
  };

  const token = signToken(user);
  res.send({ ...user, token });
});

export default handler;