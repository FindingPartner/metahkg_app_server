"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_decode_1 = __importDefault(require("jwt-decode"));
function requireAuth(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Authentication invalid.' });
    }
    const decodedToken = (0, jwt_decode_1.default)(token.slice(7));
    if (!decodedToken) {
        return res.status(401).json({
            message: 'There was a problem authorizing the request.'
        });
    }
    else {
        req.user = decodedToken;
        next();
    }
}
exports.default = requireAuth;
//# sourceMappingURL=requireAuth.js.map