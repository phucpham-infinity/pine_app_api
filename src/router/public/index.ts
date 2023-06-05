import type { Response, Request } from "express";

export const RootRender = async (req: Request, res: Response) => {
  return res.render("home");
};
