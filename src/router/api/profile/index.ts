import express from "express";
import { validate, verifyToken } from "@/middleware";
import { createProfileDto, updateProfileDto } from "./dto";
import { createCompany } from "./controllers/create_profile";
import { upadateCompany } from "./controllers/update_profile";
import { createProfileByUserId } from "./controllers/create_profile_user";

const ROUTER = {
  create: "/profile",
  createById: "/profile/:id",
  update: "/profile/:id",
};

export const ProfileRouter = express.Router();

ProfileRouter.route(ROUTER.create).post([
  verifyToken,
  validate(createProfileDto),
  createCompany,
]);

ProfileRouter.route(ROUTER.update).put([
  verifyToken,
  validate(updateProfileDto),
  upadateCompany,
]);

ProfileRouter.route(ROUTER.createById).post([
  verifyToken,
  validate(createProfileDto),
  createProfileByUserId,
]);
