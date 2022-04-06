"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.deletecomment = exports.create = exports.load = void 0;
const express_validator_1 = require("express-validator");
async function load(req, res, next, id) {
    try {
        const comment = await req.post.comments.id(id);
        if (!comment)
            return res.status(404).json({ message: 'Comment1 not found.' });
        req.comment = comment;
    }
    catch (error) {
        if (error.name === 'CastError')
            return res.status(400).json({ message: 'Invalid comment2 id.' });
        return next(error);
    }
    next();
}
exports.load = load;
async function create(req, res, next) {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        const errors = result.array({ onlyFirstError: true });
        return res.status(422).json({ errors });
    }
    try {
        const { id } = req.user;
        const { comment } = req.body;
        const post = await req.post.addComment(id, comment);
        res.status(201).json(post);
    }
    catch (error) {
        next(error);
    }
}
exports.create = create;
;
async function deletecomment(req, res, next) {
    try {
        const { comment } = req.params;
        const post = await req.post.removeComment(comment);
        res.json(post);
    }
    catch (error) {
        next(error);
    }
}
exports.deletecomment = deletecomment;
;
exports.validate = [
    (0, express_validator_1.body)('comment')
        .exists()
        .trim()
        .withMessage('is required')
        .notEmpty()
        .withMessage('cannot be blank')
        .isLength({ max: 200000 })
        .withMessage('must be at most 200000 characters long')
];
//# sourceMappingURL=comments.js.map