import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config';

export const createToken = (user: { role: any; _id: any; username: any }) => {
  // Sign the JWT
  if (!user.role) {
    throw new Error('No user role specified');
  }
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
      iss: 'api.reddit',
      aud: 'api.reddit'
    },
    config.jwt.secret,
    { algorithm: 'HS256', expiresIn: config.jwt.expiry }
  );
};

export const hashPassword = (password: string) => {
  return new Promise((resolve, reject) => {
    // Generate a salt at level 12 strength
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

export const verifyPassword = (
  passwordAttempt: string,
  hashedPassword: string
) => {
  return bcrypt.compare(passwordAttempt, hashedPassword);
};
