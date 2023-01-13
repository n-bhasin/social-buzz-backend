import express from "express";
import { auth } from "../../middleware/auth";
import {
  getSelf,
  getUserById,
  loginUser,
  registerUser,
  updateUser,
} from "./user";

const UserRouter = express.Router();

UserRouter.post("/register", registerUser);
UserRouter.post("/login", loginUser);
UserRouter.get("/self", auth, getSelf);
UserRouter.get("/:id", getUserById);
UserRouter.put("/:id", auth, updateUser);

export default UserRouter;
