import { mongoose } from "../db/mongolize";
import jwt from "jsonwebtoken";
import Joi from "joi";
const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: false,
      required: false,
      index: true,
      sparse: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: false,
      index: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      unique: false,
      required: false,
      index: true,
      sparse: true,
    },
    bio: { type: String, index: true },
    avatarUrl: { type: String, index: true },
    createTime: { type: Date, index: true, default: Date.now() },
  },
  { Collection: "user" }
);
UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id, delete ret.password;
  },
});
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE_HOURS,
    }
  );
  return token;
};

const UserModal = mongoose.model("User", UserSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(3).required().email(),
    password: Joi.string().min(3).required(),
    avatarUrl: Joi.string(),
    bio: Joi.string(),
  });
  return schema.validate(user);
};

exports.UserModal = UserModal;
exports.validateUser = validateUser;
