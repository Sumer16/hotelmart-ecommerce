import nextConnect from 'next-connect';
import axios from 'axios';

import { isAuth } from '../../../utils/auth';
import config from '../../../utils/config';

const handler = nextConnect();

handler.use(isAuth);

handler.post(async (req, res) => {
  const projectId = config.projectId;
  const dataset = config.dataset;
  const apiVersion = config.apiVersion;
  const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;

  const { data } = await axios.post(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}?returnIds=true`,
    {
      mutations: [
        {
          create: {
            _type: 'order',
            createdAt: new Date().toISOString(),
            ...req.body,
            userLastName: req.user.lastName,
            user: {
              _type: 'reference',
              _ref: req.user._id,
            },
          },
        },
      ],
    },
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${tokenWithWriteAccess}`,
      },
    }
  );

  res.status(201).send(data.results[0].id);
});

export default handler;
