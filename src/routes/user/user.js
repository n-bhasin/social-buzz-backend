import _ from "lodash";
import makeResponse from "../../utils/response";
import { UserModal, validateUser } from "../../model/User";
import { comparePassword, generateError, hashPassword } from "../utils";

export const registerUser = async (req, res, next) => {
  try {
    const userParams = req.body;
    const { error } = validateUser(userParams);

    if (error) return makeResponse(res, 400, error.details[0].message);

    let user = await UserModal.findOne({ email: userParams.email });

    if (user) {
      return makeResponse(res, 400, "Email Id already exists");
    }
    user = new UserModal(userParams);

    if (userParams.password) {
      user.password = hashPassword(userParams.password);
    }
    const data = await user.save();
    return makeResponse(res, 200, "success", {
      id: data?._id,
      email: data?.email,
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModal.findOne({ email: email });

    if (!user) return makeResponse(res, 400, "Invalid email or password");

    if (user && comparePassword(password, user.password)) {
      const token = user.generateAuthToken();
      return makeResponse(res, 200, "Success", {
        id: user?._id,
        email: user?.email,
        token,
      });
    }
    next();
  } catch (err) {
    generateError(err, req, res, next);
  }
};

export const getSelf = async (req, res, next) => {
  try {
    if (req?.user) {
      const user = await UserModal.findOne({ email: req?.user?.email });
      return makeResponse(res, 200, "Success", user.toJSON());
    }
  } catch (err) {
    generateError(err, req, res, next);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserModal.findOne({ _id: id }).select(
      "name avatarUrl bio"
    );
    if (!user) return makeResponse(res, 400, "User doest not exist");

    return makeResponse(res, 200, "Success", user.toJSON());
  } catch (err) {
    generateError(err, req, res, next);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userParams = req.body;
    if (id) {
      const user = await UserModal.findById(id);

      if (!user)
        return makeResponse(res, 400, "User does not exist with given id");
      if (user.email !== userParams.email)
        return makeResponse(
          res,
          400,
          "User does not exist with given email id"
        );

      const _user = await UserModal.findByIdAndUpdate(id, userParams, {
        new: true,
      });

      return makeResponse(res, 200, "Success", _user.toJSON());
    }
  } catch (err) {
    generateError(err, req, res, next);
  }
};
