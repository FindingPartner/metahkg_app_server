import Post from '../models/post';
import User from '../models/user';
import { body, validationResult } from 'express-validator';
import { Request } from 'express-validator/src/base';

export async function load(
  req: any,
  res: any,
  next: any,
  id: any
) {
  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    req.post = post;
  } catch (error) {
    if (error.name === 'CastError')
      return res.status(400).json({ message: 'Invalid post id.' });
    return next(error);
  }
  next();
}

export async function create(
  req: Request,
  res: any,
  next: any
) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    res.status(422);
    return res.send(errors);
  }

  try {
    const { title, url, category, type, text } = req.body;
    const author = req.user.id;
    const post = await Post.create({
      title,
      url,
      author,
      category,
      type,
      text
    });
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
}

export async function show (
  req: any,
  res: any,
  next: any
) {
  try {
    const { id } = req.post;
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export async function list (
  req: any,
  res: any,
  next: (arg0: any) => void
) {
  try {
    const { sortType = '-score' } = req.body;
    const posts = await Post.find().sort(sortType);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export async function listByCategory (
  req: any,
  res: any,
  next: (arg0: any) => void
) {
  try {
    const { category } = req.params;
    const { sortType = '-score' } = req.body;
    const posts = await Post.find({ category }).sort(sortType);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export async function listByUser (
  req: { params: { username: any }; body: { sortType?: '-score' } },
  res: { json: (arg0: any) => void },
  next: (arg0: any) => void
) {
  try {
    const { username } = req.params;
    const { sortType = '-score' } = req.body;
    const author = await User.findOne({ username });
    const posts = await Post.find({ author: author.id }).sort(sortType);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export async function deletepost (
  req: any,
  res: any,
  next: (arg0: any) => void
) {
  try {
    if (req.post.author._id.equals(req.user.id)) {
      await req.post.remove();
      res.json({ message: 'Your post successfully deleted.' });
    } else {
      res
        .status(400)
        .json({ message: "User's only authorized to delete this post." });
    }
  } catch (error) {
    next(error);
  }
};

function urlOrTextIsValid (
  req: Request,
  res: any,
  next: { (error?: any): void; (error?: any): void }
) {
  if (req.body.type === 'link') {
    const chain = body('url')
      .exists()
      .withMessage('is required')

      .isURL()
      .withMessage('is invalid');

    chain(req, res, next);
  } else {
    const chain = body('text')
      .exists()
      .withMessage('is required')

      .isLength({ min: 4 })
      .withMessage('must be at least 4 characters long');

    chain(req, res, next);
  }
};

export const validate: any = [
  body('title')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ max: 100 })
    .withMessage('must be at most 100 characters long'),
  body('category')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank'),
  body('type')
    .exists()
    .withMessage('is required')

    .isIn(['link', 'text'])
    .withMessage('must be a link or text post'),
  urlOrTextIsValid
];
