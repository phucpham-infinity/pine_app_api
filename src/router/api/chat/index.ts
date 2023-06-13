import express from "express";
import { validate, verifyToken } from "@/middleware";
import { sendChatDto } from "./dto";

import { sendMessage } from "./controllers/send_message";
import { messageByMe } from "./controllers/message_by_me";

const ROUTER = {
  send: "/chat/send",
  me: "/chat/me",
};

export const ChatRouter = express.Router();

ChatRouter.route(ROUTER.send).post([
  verifyToken,
  validate(sendChatDto),
  sendMessage,
]);

ChatRouter.route(ROUTER.me).get([verifyToken, messageByMe]);
