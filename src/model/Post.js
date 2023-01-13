import { mongoose } from "../db/mongolize";
import Joi from "joi";

const PostSchema = mongoose.Schema({
  image: { type: String, required: true, index: true },
  caption: { type: String, required: false, index: true },
  likes: { type: Number, index: true, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createTime: { type: Date, default: Date.now, required: true },
});

PostSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const validate = (posts) => {
  const schema = Joi.object({
    image: Joi.string().required(),
    caption: Joi.string(),
    likes: Joi.number(),
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$}/),
  });
  return schema.validate(posts);
};
const PostModal = mongoose.model("Posts", PostSchema);
exports.PostModal = PostModal;
exports.validatePost = validate;
