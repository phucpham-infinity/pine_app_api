import express, { Router } from "express";

import { validate, verifyToken } from "@/middleware";
import { registerDto, loginDto, updateByPhoneDto } from "./dto";

import { register } from "./controllers/register";
import { loginWithPhone } from "./controllers/loginWithPhone";
import { me } from "./controllers/me";
import { updateByPhone } from "./controllers/updateByPhone";
import { getByPhone } from "./controllers/getByPhone";

const ROUTER = {
  register: "/user/register",
  loginWithPhone: "/user/login-with-phone",
  me: "/user/me",
  updateByPhone: "/user/update-by-phone",
  userByPhone: "/user/phone/:phone",
};

export const UserRouter = express.Router();

UserRouter.route(ROUTER.register).post([validate(registerDto), register]);

UserRouter.route(ROUTER.loginWithPhone).post([
  validate(loginDto),
  loginWithPhone,
]);

UserRouter.route(ROUTER.me).get([verifyToken, me]);
UserRouter.route(ROUTER.userByPhone).get([getByPhone]);

UserRouter.route(ROUTER.updateByPhone).post([
  validate(updateByPhoneDto),
  updateByPhone,
]);
