// jwtHelpers.js
const jwt = require('jsonwebtoken');

const generateToken = (user, secret, expiresIn) => {
  const payload = {
    id: user._id || user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };