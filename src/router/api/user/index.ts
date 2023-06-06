import express, { Router } from "express";

import { validate, verifyToken } from "@/middleware";
import { registerDto, loginDto, updateByPhoneDto } from "./dto";

import { register } from "./controllers/register";
import { loginWithPhone } from "./controllers/loginWithPhone";
import { me } from "./controllers/me";
import { updateByPhone } from "./controllers/updateByPhone";

const ROUTER = {
  register: "/user/register",
  loginWithPhone: "/user/login-with-phone",
  me: "/user/me",
  updateByPhone: "/user/update-by-phone",
};

export const UserRouter = express.Router();

UserRouter.use(ROUTER.register, validate(registerDto))
  .route(ROUTER.register)
  .post(register);

UserRouter.use(ROUTER.loginWithPhone, validate(loginDto))
  .route(ROUTER.loginWithPhone)
  .post(loginWithPhone);

UserRouter.use(ROUTER.me, verifyToken).route(ROUTER.me).get(me);
UserRouter.use(ROUTER.updateByPhone, validate(updateByPhoneDto))
  .route(ROUTER.updateByPhone)
  .post(updateByPhone);
