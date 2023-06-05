import { Request, Response } from "express";
import UserSchema from "@/models/user";

export const register = async (req: Request, res: Response) => {
  const body = req.body;

  const newUser = new UserSchema({
    username: body.username,
    password: body.password,
    email: body.email,
  });
  try {
    const user = await newUser.save();
    return res.status(200).json({ status: "ok", data: user.doc() });
  } catch (error) {
    return res.status(400).json({ status: 400, error });
  }
};
