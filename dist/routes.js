"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("./controllers/users");
const posts_1 = require("./controllers/posts");
const votes_1 = require("./controllers/votes");
const comments_1 = require("./controllers/comments");
const requireAuth_1 = __importDefault(require("./middlewares/requireAuth"));
const postAuth_1 = __importDefault(require("./middlewares/postAuth"));
const commentAuth_1 = __importDefault(require("./middlewares/commentAuth"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//Authentication
router.post('/signup', users_1.validate, users_1.signup);
router.post('/authenticate', users_1.validate, users_1.authenticate);
//Posts
router.param('post', posts_1.load);
router.post('/posts', [requireAuth_1.default, posts_1.validate], posts_1.create);
router.get('/post/:post', posts_1.show);
router.get('/posts', posts_1.list);
router.get('/posts/:category', posts_1.listByCategory);
router.get('/user/:username', posts_1.listByUser);
router.delete('/post/:post', [requireAuth_1.default, postAuth_1.default], posts_1.deletepost);
//Post votes
router.get('/post/:post/upvote', requireAuth_1.default, votes_1.upvote);
router.get('/post/:post/downvote', requireAuth_1.default, votes_1.downvote);
router.get('/post/:post/unvote', requireAuth_1.default, votes_1.downvote);
//Posts comments
router.param('comment', comments_1.load);
router.post('/post/:post', [requireAuth_1.default, comments_1.validate], comments_1.create);
router.get('/post/:post/:comment/upvote', [requireAuth_1.default], votes_1.com_upvote);
router.get('/post/:post/:comment/downvote', [requireAuth_1.default], votes_1.com_downvote);
router.get('/post/:post/:comment/unvote', [requireAuth_1.default], votes_1.com_unvote);
router.delete('/post/:post/:comment', [requireAuth_1.default, commentAuth_1.default], comments_1.deletecomment);
exports.default = (app) => {
    app.use('/api', router);
    app.use((req, res, next) => {
        const error = { message: 'Not found', status: 404 };
        next(error);
    });
    app.use((error, req, res) => {
        res.status(error.status || 500).json({
            message: error.message
        });
    });
};
//# sourceMappingURL=routes.js.map