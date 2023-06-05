import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const token =
  //     req.body.token || req.query.token || req.headers["x-access-token"];
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(403).json({
      status: 403,
      error: "A token is required for authentication",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET || "MICRO_APP");
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({
      status: 401,
      error: "Invalid Token",
    });
  }
  return next();
};
