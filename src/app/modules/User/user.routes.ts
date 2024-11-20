import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controllers";
import auth from "../../middlewares/auth";
const router = express.Router();

router.post(
  "/",
  auth("ADMIN", "SUPER_ADMIN", "DOCTOR"),
  userController.createAdmin
);

export const userRoute = router;
