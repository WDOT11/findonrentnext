const jwt = require('jsonwebtoken');
require('dotenv').config();

/** authMiddelware to check the validations or restrictions - Coded by Raj July 09 2025 */
const authMiddleware = (req, res, next) => {
  /* 1. Get the token from the header */
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; /* "Bearer token" */

  if (!token) {
    return res.status(200).json({ message: 'Access denied. No token provided.', success: false, rcode: 0 });
  }

  try { 
    /* 2. Verify the token */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* 3. Attach user info to request object */
    req.user = decoded;

    /* 4. Proceed to the next middleware or route */
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(200).json({ message: 'Invalid or expired token.', success: false, rcode: 0 });
  }
};

module.exports = authMiddleware;
