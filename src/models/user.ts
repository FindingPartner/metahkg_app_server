import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userModel = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' }
});

userModel.set('toJSON', { getters: true });
// @ts-ignore
userModel.options.toJSON.transform = (_doc: any, ret: any) => {
  const obj = { ...ret };
  delete obj._id;
  delete obj.__v;
  delete obj.password;
  return obj;
};

export default mongoose.model('user', userModel);
