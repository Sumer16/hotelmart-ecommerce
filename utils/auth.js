import jwt from 'jsonwebtoken';

const signToken = (user) => {
  return jwt.sign(user, process.env.JWT_WEB_SECRET, {
    expiresIn: '30d',
  });
};

export { signToken };