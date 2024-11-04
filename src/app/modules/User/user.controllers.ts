import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  // console.log(req.body)

  const result = await userService.createAdmin(req.body);

  res.json({ message: " Admin created successfully ", data: result });
};

export const userController = {
  createAdmin,
};