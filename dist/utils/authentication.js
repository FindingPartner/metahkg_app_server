"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../config"));
const createToken = (user) => {
    // Sign the JWT
    if (!user.role) {
        throw new Error('No user role specified');
    }
    return jsonwebtoken_1.default.sign({
        id: user._id,
        username: user.username,
        role: user.role,
        iss: 'api.reddit',
        aud: 'api.reddit'
    }, config_1.default.jwt.secret, { algorithm: 'HS256', expiresIn: config_1.default.jwt.expiry });
};
exports.createToken = createToken;
const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        // Generate a salt at level 12 strength
        bcryptjs_1.default.genSalt(12, (err, salt) => {
            if (err) {
                reject(err);
            }
            bcryptjs_1.default.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    });
};
exports.hashPassword = hashPassword;
const verifyPassword = (passwordAttempt, hashedPassword) => {
    return bcryptjs_1.default.compare(passwordAttempt, hashedPassword);
};
exports.verifyPassword = verifyPassword;
//# sourceMappingURL=authentication.js.map