import express, { Router } from "express";

import { validate, verifyToken } from "@/middleware";
import { registerDto, loginDto, updateByPhoneDto } from "./dto";

import { register } from "./controllers/register";
import { loginWithPhone } from "./controllers/loginWithPhone";
import { me } from "./controllers/me";
import { updateByPhone } from "./controllers/updateByPhone";
import { getByPhone } from "./controllers/getByPhone";
import { findAll } from "./controllers/findAll";
import { findById } from "./controllers/findById";
import { changePin } from "./controllers/changePin";
import { changePhone } from "./controllers/changePhone";

const ROUTER = {
  register: "/user/register",
  loginWithPhone: "/user/login-with-phone",
  me: "/user/me",
  all: "/user",
  updateByPhone: "/user/update-by-phone",
  userByPhone: "/user/phone/:phone",
  userById: "/user/:id",
  changePin: "/change/pin",
  changePhone: "/change/phone",
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

UserRouter.route(ROUTER.all).get([verifyToken, findAll]);
UserRouter.route(ROUTER.userById).get([verifyToken, findById]);
UserRouter.route(ROUTER.changePin).post([verifyToken, changePin]);
UserRouter.route(ROUTER.changePhone).post([verifyToken, changePhone]);
