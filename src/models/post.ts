import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const voteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    vote: { type: Number, required: true }
  },
  { _id: false }
);

const commentSchema: any = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  body: { type: String, required: true },
  created: { type: Date, default: Date.now },
  votes: [voteSchema],
  score: { type: Number, default: 0 }
});

commentSchema.set('toJSON', { getters: true });
commentSchema.options.toJSON.transform = (_doc: any, ret: any) => {
  const obj = { ...ret };
  delete obj._id;
  return obj;
};
commentSchema.methods.cvote = function (user: any, vote: number) {
  const existingVote = this.votes.find(
    (v: { user: { _id: { equals: (arg0: any) => any } } }) =>
      v.user._id.equals(user)
  );

  if (existingVote) {
    // reset score
    this.score -= existingVote.vote;
    if (vote == 0) {
      // remove vote
      this.votes.pull(existingVote);
    } else {
      //change vote

      this.score += vote;
      existingVote.vote = vote;
    }
  } else if (vote !== 0) {
    // new vote
    this.score += vote;
    this.votes.push({ user, vote });
  }
  console.log('saving comment vote');
  return this.save();
};

const postSchema: any = new Schema({
  title: { type: String, required: true },
  url: { type: String },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  category: { type: String, required: true },
  score: { type: Number, default: 0 },
  votes: [voteSchema],
  comments: [commentSchema],
  created: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  type: { type: String, default: 'link', required: true },
  text: { type: String }
});

postSchema.set('toJSON', { getters: true, virtuals: true });
postSchema.options.toJSON.transform = (_doc: any, ret: any) => {
  const obj = { ...ret };
  delete obj._id;
  delete obj.__v;
  return obj;
};

postSchema.virtual('votePercentage').get(function () {
  if (this.votes.length == 0) return 0;
  const upVotes = this.votes.filter((v: { vote: number }) => v.vote == 1);
  return Math.floor((upVotes.length / this.votes.length) * 100);
});

postSchema.methods.vote = function (user: any, vote: number) {
  const existingVote = this.votes.find(
    (v: { user: { _id: { equals: (arg0: any) => any } } }) =>
      v.user._id.equals(user)
  );

  if (existingVote) {
    // reset score
    this.score -= existingVote.vote;
    if (vote == 0) {
      // remove vote
      this.votes.pull(existingVote);
    } else {
      //change vote

      // this will be wrong, if original vote was 1, and we make 1 again , or vice versa,
      // since the original number is not offseted
      this.score += vote;
      existingVote.vote = vote;
    }
  } else if (vote !== 0) {
    // new vote
    this.score += vote;
    this.votes.push({ user, vote });
  }

  return this.save();
};

postSchema.methods.addComment = function (author: any, body: any) {
  this.comments.push({ author, body });
  return this.save();
};

postSchema.methods.removeComment = function (id: any) {
  const comment = this.comments.id(id);
  if (!comment) throw new Error('Comment3 not found');
  comment.remove();
  return this.save();
};

postSchema.methods.com_vote = function (user: any, id: any, vote: any) {
  const comment = this.comments.id(id);

  if (!comment) throw new Error(`Comment4 not found ,  id: ${id}`);
  comment.cvote(user, vote);
  console.log('comment vote should be saved, saving post now');
  return this.save(); // is this needed?
};

postSchema.pre(/^find/, function () {
  this.populate('author').populate('comments.author', '-role');
});

postSchema.pre('save', function (next: () => void) {
  this.wasNew = this.isNew;
  next();
});

postSchema.post(
  'save',
  function (
    doc: {
      populate: (arg0: string) => {
        (): any;
        new (): any;
        populate: {
          (arg0: string, arg1: string): {
            (): any;
            new (): any;
            execPopulate: { (): Promise<any>; new (): any };
          };
          new (): any;
        };
      };
    },
    next: () => any
  ) {
    if (this.wasNew) this.vote(this.author._id, 1);
    doc
      .populate('author')
      .populate('comments.author', '-role')
      .execPopulate()
      .then(() => next());
  }
);

export default mongoose.model('post', postSchema);