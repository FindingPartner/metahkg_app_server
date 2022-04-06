import { validate, signup, authenticate } from './controllers/users';
import {
  load,
  validate as _validate,
  create,
  show,
  list,
  listByCategory,
  listByUser,
  deletepost
} from './controllers/posts';
import {
  upvote,
  downvote,
  com_upvote,
  com_downvote,
  com_unvote
} from './controllers/votes';
import {
  load as _load,
  validate as __validate,
  create as _create,
  deletecomment
} from './controllers/comments';
import requireAuth from './middlewares/requireAuth';
import postAuth from './middlewares/postAuth';
import commentAuth from './middlewares/commentAuth';
import express, { Express } from 'express';

const router = express.Router();

//Authentication
router.post('/signup', validate, signup);
router.post('/authenticate', validate, authenticate);

//Posts
router.param('post', load);
router.post('/posts', [requireAuth, _validate], create);
router.get('/post/:post', show);
router.get('/posts', list);
router.get('/posts/:category', listByCategory);
router.get('/user/:username', listByUser);
router.delete('/post/:post', [requireAuth, postAuth], deletepost);

//Post votes
router.get('/post/:post/upvote', requireAuth, upvote);
router.get('/post/:post/downvote', requireAuth, downvote);
router.get('/post/:post/unvote', requireAuth, downvote);

//Posts comments
router.param('comment', _load);
router.post('/post/:post', [requireAuth, __validate], _create);
router.get('/post/:post/:comment/upvote', [requireAuth], com_upvote);
router.get('/post/:post/:comment/downvote', [requireAuth], com_downvote);
router.get('/post/:post/:comment/unvote', [requireAuth], com_unvote);
router.delete(
  '/post/:post/:comment',

  [requireAuth, commentAuth],
  deletecomment
);

export default (app: Express) => {
  app.use('/api', router);

  app.use((req, res, next) => {
    const error = { message: 'Not found', status: 404 };
    next(error);
  });

  app.use((error: { message: string; status: number }, req: any, res: any) => {
    res.status(error.status || 500).json({
      message: error.message
    });
  });
};
