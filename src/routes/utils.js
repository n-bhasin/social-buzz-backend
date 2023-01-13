import {
  InvalidInputError,
  InternalServerError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
} from "../utils/errors";
import logger from "../utils/logging";
import bcrypt from "bcrypt";

export const generateError = (err, req, res, next, _) => {
  logger.error("request id: " + req.requestId + " error: " + err);
  if (err instanceof InvalidInputError || err instanceof ValidationError) {
    res.statusCode = 400;
    return next(err);
  } else if (err instanceof AuthenticationError) {
    res.statusCode = 403;
    return next(err);
  } else if (err instanceof AuthorizationError) {
    res.statusCode = 401;
    return next(err);
  } else if (err instanceof NotFoundError) {
    res.statusCode = 404;
    return next(err);
  } else {
    res.statusCode = 500;
    return next(new InternalServerError());
  }
};

export const comparePassword = (newPassword, oldPassword) => {
  return bcrypt.compareSync(newPassword, oldPassword);
};
export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(Number(process.env.HASH_SALT_ROUNDS));
  return bcrypt.hashSync(password, salt);
};
