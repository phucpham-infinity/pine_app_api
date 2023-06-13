import { validate, verifyToken } from "@/middleware";
import express from "express";

import { createSettingDto, updateSettingDto } from "./dto";
import { createForMe } from "./controllers/create_setting";
import { updateSetting } from "./controllers/update_setting";
import { getSettingById } from "./controllers/get_setting_by_id";
import { getSettingByMe } from "./controllers/get_setting_by_user";

const ROUTER = {
  createForMe: "/setting",
  update: "/setting",
  getByMe: "/setting/me",
  getById: "/setting/:id",
};

export const SettingRouter = express.Router();

SettingRouter.route(ROUTER.createForMe).post([
  verifyToken,
  validate(createSettingDto),
  createForMe,
]);

SettingRouter.route(ROUTER.update).put([
  verifyToken,
  validate(updateSettingDto),
  updateSetting,
]);

SettingRouter.route(ROUTER.getByMe).get([verifyToken, getSettingByMe]);

SettingRouter.route(ROUTER.getById).get([verifyToken, getSettingById]);
