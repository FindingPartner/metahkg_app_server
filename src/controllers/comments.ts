import { body, ValidationError, validationResult } from 'express-validator';
import { Request } from 'express-validator/src/base';

export async function load(req: any, res: any, next: any, id: any) {
  try {
    const comment = await req.post.comments.id(id);
    if (!comment)
      return res.status(404).json({ message: 'Comment1 not found.' });
    req.comment = comment;
  } catch (error) {
    if (error.name === 'CastError')
      return res.status(400).json({ message: 'Invalid comment2 id.' });
    return next(error);
  }
  next();
}

export async function create (
  req: Request,
  res: any,
  next: (arg0: any) => void
) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }

  try {
    const { id } = req.user;
    const { comment } = req.body;
    const post = await req.post.addComment(id, comment);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export async function deletecomment (
  req: any,
  res: any,
  next: (arg0: any) => void
) {
  try {
    const { comment } = req.params;
    const post = await req.post.removeComment(comment);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const validate: any = [
  body('comment')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ max: 200000 })
    .withMessage('must be at most 200000 characters long')
];
