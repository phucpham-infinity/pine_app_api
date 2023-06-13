import express from "express";
import { validate, verifyToken } from "@/middleware";
import { createProfileDto, updateProfileDto } from "./dto";
import { createCompany } from "./controllers/create_profile";
import { upadateCompany } from "./controllers/update_profile";

const ROUTER = {
  create: "/profile",
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
