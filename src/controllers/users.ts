import User from '../models/user';
import jwtDecode from 'jwt-decode';
import { body, validationResult } from 'express-validator';

import {
  createToken,
  hashPassword,
  verifyPassword
} from '../utils/authentication';

export async function signup(req: any, res: any) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }

  try {
    const { username } = req.body;

    const hashedPassword = await hashPassword(req.body.password);

    const userData = {
      username: username.toLowerCase(),
      password: hashedPassword
    };

    const existingUsername = await User.findOne({
      username: userData.username
    }).lean();

    if (existingUsername) {
      return res.status(400).json({
        message: 'Username already exists.'
      });
    }

    const newUser = new User(userData);
    const savedUser: any = await newUser.save();

    if (savedUser) {
      const token = createToken(savedUser);
      const decodedToken: { exp: Date } = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      const { username, role, id } = savedUser;
      const userInfo = {
        username,
        role,
        id
      };

      return res.json({
        message: 'User created!',
        token,
        userInfo,
        expiresAt
      });
    } else {
      return res.status(400).json({
        message: 'There was a problem creating your account.'
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: 'There was a problem creating your account.'
    });
  }
}

export async function authenticate(req: any, res: any) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      username: username.toLowerCase()
    });

    if (!user) {
      return res.status(403).json({
        message: 'Wrong username or password.'
      });
    }

    const passwordValid = await verifyPassword(password, user.password);

    if (passwordValid) {
      const token = createToken(user);
      const decodedToken: { exp: Date } = jwtDecode(token);
      const expiresAt = decodedToken.exp;
      const { username, role, id } = user;
      const userInfo = { username, role, id };

      res.json({
        message: 'Authentication successful!',
        token,
        userInfo,
        expiresAt
      });
    } else {
      res.status(403).json({
        message: 'Wrong username or password.'
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.'
    });
  }
}

export const validate: any = [
  body('username')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ max: 32 })
    .withMessage('must be at most 32 characters long')

    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('contains invalid characters'),

  body('password')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ min: 6 })
    .withMessage('must be at least 6 characters long')

    .isLength({ max: 50 })
    .withMessage('must be at most 50 characters long')
];
