import nextConnect from 'next-connect';

const handler = nextConnect();

handler.get(async (req, res) => {
  const categories = ['Beverages', 'Breads', 'Cookies', 'Danish', 'Muffins'];
  
  res.send(categories);
});

export default handler;
