"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.deletepost = exports.listByUser = exports.listByCategory = exports.list = exports.show = exports.create = exports.load = void 0;
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
const express_validator_1 = require("express-validator");
async function load(req, res, next, id) {
    try {
        const post = await post_1.default.findById(id);
        if (!post)
            return res.status(404).json({ message: 'Post not found.' });
        req.post = post;
    }
    catch (error) {
        if (error.name === 'CastError')
            return res.status(400).json({ message: 'Invalid post id.' });
        return next(error);
    }
    next();
}
exports.load = load;
async function create(req, res, next) {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        const errors = result.array({ onlyFirstError: true });
        res.status(422);
        return res.send(errors);
    }
    try {
        const { title, url, category, type, text } = req.body;
        const author = req.user.id;
        const post = await post_1.default.create({
            title,
            url,
            author,
            category,
            type,
            text
        });
        res.status(201).json(post);
    }
    catch (error) {
        next(error);
    }
}
exports.create = create;
async function show(req, res, next) {
    try {
        const { id } = req.post;
        const post = await post_1.default.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
        res.json(post);
    }
    catch (error) {
        next(error);
    }
}
exports.show = show;
;
async function list(req, res, next) {
    try {
        const { sortType = '-score' } = req.body;
        const posts = await post_1.default.find().sort(sortType);
        res.json(posts);
    }
    catch (error) {
        next(error);
    }
}
exports.list = list;
;
async function listByCategory(req, res, next) {
    try {
        const { category } = req.params;
        const { sortType = '-score' } = req.body;
        const posts = await post_1.default.find({ category }).sort(sortType);
        res.json(posts);
    }
    catch (error) {
        next(error);
    }
}
exports.listByCategory = listByCategory;
;
async function listByUser(req, res, next) {
    try {
        const { username } = req.params;
        const { sortType = '-score' } = req.body;
        const author = await user_1.default.findOne({ username });
        const posts = await post_1.default.find({ author: author.id }).sort(sortType);
        res.json(posts);
    }
    catch (error) {
        next(error);
    }
}
exports.listByUser = listByUser;
;
async function deletepost(req, res, next) {
    try {
        if (req.post.author._id.equals(req.user.id)) {
            await req.post.remove();
            res.json({ message: 'Your post successfully deleted.' });
        }
        else {
            res
                .status(400)
                .json({ message: "User's only authorized to delete this post." });
        }
    }
    catch (error) {
        next(error);
    }
}
exports.deletepost = deletepost;
;
function urlOrTextIsValid(req, res, next) {
    if (req.body.type === 'link') {
        const chain = (0, express_validator_1.body)('url')
            .exists()
            .withMessage('is required')
            .isURL()
            .withMessage('is invalid');
        chain(req, res, next);
    }
    else {
        const chain = (0, express_validator_1.body)('text')
            .exists()
            .withMessage('is required')
            .isLength({ min: 4 })
            .withMessage('must be at least 4 characters long');
        chain(req, res, next);
    }
}
;
exports.validate = [
    (0, express_validator_1.body)('title')
        .exists()
        .trim()
        .withMessage('is required')
        .notEmpty()
        .withMessage('cannot be blank')
        .isLength({ max: 100 })
        .withMessage('must be at most 100 characters long'),
    (0, express_validator_1.body)('category')
        .exists()
        .trim()
        .withMessage('is required')
        .notEmpty()
        .withMessage('cannot be blank'),
    (0, express_validator_1.body)('type')
        .exists()
        .withMessage('is required')
        .isIn(['link', 'text'])
        .withMessage('must be a link or text post'),
    urlOrTextIsValid
];
//# sourceMappingURL=posts.js.map