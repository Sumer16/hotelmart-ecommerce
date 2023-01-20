import nc from 'next-connect'; // Implement backend API in NextJS

import client from '../../../utils/client';

const handler = nc();

handler.get(async (req, res) => {
  const product = await client.fetch(`*[_type == "Product" && _id == $id][0]`, {
    id: req.query.id, // id entered afer /product
  });
  res.send(product); // return product from this backend
});

export default handler;