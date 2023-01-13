import jwt from "jsonwebtoken";
import { AuthenticationError } from "../utils/errors";
import makeResponse from "../utils/response";

const authorization = (req, res, next) => {
  try {
    let token = req.headers["authorization"];

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ");

      const decode = jwt.verify(token[1], process.env.JWT_PRIVATE_KEY);
      req.user = decode;
      return next();
    } else {
      return next(new AuthenticationError("Missing authorization"));
    }
  } catch (err) {
    return makeResponse(res, 400, "Invalid Token");
  }
};

export const auth = authorization;
