"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function postAuth(req, res, next) {
    if (req.post.author._id.equals(req.user.id) || req.user.admin)
        return next();
    res.status(401).end();
}
exports.default = postAuth;
//# sourceMappingURL=postAuth.js.map