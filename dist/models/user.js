"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userModel = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'user' }
});
userModel.set('toJSON', { getters: true });
// @ts-ignore
userModel.options.toJSON.transform = (_doc, ret) => {
    const obj = Object.assign({}, ret);
    delete obj._id;
    delete obj.__v;
    delete obj.password;
    return obj;
};
exports.default = mongoose_1.default.model('user', userModel);
//# sourceMappingURL=user.js.map