export async function upvote(req: any, res: any) {
  const { id } = req.user;
  const post = await req.post.vote(id, 1);
  res.json(post);
}

export async function downvote(req: any, res: any) {
  const { id } = req.user;
  const post = await req.post.vote(id, -1);
  res.json(post);
}

export async function unvote(req: any, res: any) {
  const { id } = req.user;
  const post = await req.post.vote(id, 0);
  res.json(post);
}

export async function com_upvote(req: any, res: any) {
  const { comment } = req;
  const { id } = req.user;
  // console.log(`received postid ${id} commentid ${comment}`)
  // throw new Error(`received postid ${id} commentid ${comment} req ${req}`)
  const post = await req.post.com_vote(id, comment._id, 1);
  res.json(post);
}

export async function com_downvote(req: any, res: any) {
  const { comment } = req;
  const { id } = req.user;
  // console.log(`received postid ${id} commentid ${comment}`)
  // throw new Error(`received postid ${id} commentid ${comment} req ${req}`)
  const post = await req.post.com_vote(id, comment._id, -1);
  res.json(post);
}

export async function com_unvote(req: any, res: any) {
  const { comment } = req;
  const { id } = req.user;
  // console.log(`received postid ${id} commentid ${comment}`)
  // throw new Error(`received postid ${id} commentid ${comment} req ${req}`)
  const post = await req.post.com_vote(id, comment._id, 0);
  res.json(post);
}
