"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.com_unvote = exports.com_downvote = exports.com_upvote = exports.unvote = exports.downvote = exports.upvote = void 0;
async function upvote(req, res) {
    const { id } = req.user;
    const post = await req.post.vote(id, 1);
    res.json(post);
}
exports.upvote = upvote;
async function downvote(req, res) {
    const { id } = req.user;
    const post = await req.post.vote(id, -1);
    res.json(post);
}
exports.downvote = downvote;
async function unvote(req, res) {
    const { id } = req.user;
    const post = await req.post.vote(id, 0);
    res.json(post);
}
exports.unvote = unvote;
async function com_upvote(req, res) {
    const { comment } = req;
    const { id } = req.user;
    // console.log(`received postid ${id} commentid ${comment}`)
    // throw new Error(`received postid ${id} commentid ${comment} req ${req}`)
    const post = await req.post.com_vote(id, comment._id, 1);
    res.json(post);
}
exports.com_upvote = com_upvote;
async function com_downvote(req, res) {
    const { comment } = req;
    const { id } = req.user;
    // console.log(`received postid ${id} commentid ${comment}`)
    // throw new Error(`received postid ${id} commentid ${comment} req ${req}`)
    const post = await req.post.com_vote(id, comment._id, -1);
    res.json(post);
}
exports.com_downvote = com_downvote;
async function com_unvote(req, res) {
    const { comment } = req;
    const { id } = req.user;
    // console.log(`received postid ${id} commentid ${comment}`)
    // throw new Error(`received postid ${id} commentid ${comment} req ${req}`)
    const post = await req.post.com_vote(id, comment._id, 0);
    res.json(post);
}
exports.com_unvote = com_unvote;
//# sourceMappingURL=votes.js.map