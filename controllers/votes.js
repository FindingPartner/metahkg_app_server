exports.upvote = async (req, res) => {
    const {id} = req.user;
    const post = await req.post.vote(id, 1);
    res.json(post);
};

exports.downvote = async (req, res) => {
    const {id} = req.user;
    const post = await req.post.vote(id, -1);
    res.json(post);
};

exports.unvote = async (req, res) => {
    const {id} = req.user;
    const post = await req.post.vote(id, 0);
    res.json(post);
};

exports.com_upvote = async (req, res) => {

    const {comment} = req;
    const {id} = req.user;
    // console.log(`received postid ${id} commentid ${comment}`)
    // throw new Error(`received postid ${id} commentid ${comment} req ${req}`)
    const post = await req.post.com_vote(id, comment._id,1);
    res.json(post);
};

exports.com_downvote = async (req, res) => {
    const {comment} = req;
    const {id} = req.user;
    // console.log(`received postid ${id} commentid ${comment}`)
    // throw new Error(`received postid ${id} commentid ${comment} req ${req}`)
    const post = await req.post.com_vote(id, comment._id,-1);
    res.json(post);
};

exports.com_unvote = async (req, res) => {
    const {comment} = req;
    const {id} = req.user;
    // console.log(`received postid ${id} commentid ${comment}`)
    // throw new Error(`received postid ${id} commentid ${comment} req ${req}`)
    const post = await req.post.com_vote(id, comment._id,0);
    res.json(post);
};
