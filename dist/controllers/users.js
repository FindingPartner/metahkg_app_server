"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.authenticate = exports.signup = void 0;
const user_1 = __importDefault(require("../models/user"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const express_validator_1 = require("express-validator");
const authentication_1 = require("../utils/authentication");
async function signup(req, res) {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        const errors = result.array({ onlyFirstError: true });
        return res.status(422).json({ errors });
    }
    try {
        const { username } = req.body;
        const hashedPassword = await (0, authentication_1.hashPassword)(req.body.password);
        const userData = {
            username: username.toLowerCase(),
            password: hashedPassword
        };
        const existingUsername = await user_1.default.findOne({
            username: userData.username
        }).lean();
        if (existingUsername) {
            return res.status(400).json({
                message: 'Username already exists.'
            });
        }
        const newUser = new user_1.default(userData);
        const savedUser = await newUser.save();
        if (savedUser) {
            const token = (0, authentication_1.createToken)(savedUser);
            const decodedToken = (0, jwt_decode_1.default)(token);
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
        }
        else {
            return res.status(400).json({
                message: 'There was a problem creating your account.'
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: 'There was a problem creating your account.'
        });
    }
}
exports.signup = signup;
async function authenticate(req, res) {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        const errors = result.array({ onlyFirstError: true });
        return res.status(422).json({ errors });
    }
    try {
        const { username, password } = req.body;
        const user = await user_1.default.findOne({
            username: username.toLowerCase()
        });
        if (!user) {
            return res.status(403).json({
                message: 'Wrong username or password.'
            });
        }
        const passwordValid = await (0, authentication_1.verifyPassword)(password, user.password);
        if (passwordValid) {
            const token = (0, authentication_1.createToken)(user);
            const decodedToken = (0, jwt_decode_1.default)(token);
            const expiresAt = decodedToken.exp;
            const { username, role, id } = user;
            const userInfo = { username, role, id };
            res.json({
                message: 'Authentication successful!',
                token,
                userInfo,
                expiresAt
            });
        }
        else {
            res.status(403).json({
                message: 'Wrong username or password.'
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: 'Something went wrong.'
        });
    }
}
exports.authenticate = authenticate;
exports.validate = [
    (0, express_validator_1.body)('username')
        .exists()
        .trim()
        .withMessage('is required')
        .notEmpty()
        .withMessage('cannot be blank')
        .isLength({ max: 32 })
        .withMessage('must be at most 32 characters long')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('contains invalid characters'),
    (0, express_validator_1.body)('password')
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
//# sourceMappingURL=users.js.map