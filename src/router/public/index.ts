import type { Response, Request } from "express";
import path from "path";

export const RootRender = async (req: Request, res: Response) => {
  return res.sendFile(path.join(__dirname + "/public/index.html"));
};
