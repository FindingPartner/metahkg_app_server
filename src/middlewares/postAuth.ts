export default function postAuth(req: any, res: any, next: any) {
  if (req.post.author._id.equals(req.user.id) || req.user.admin) return next();
  res.status(401).end();
}
