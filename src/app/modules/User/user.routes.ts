import express from "express";
import { userController } from "./user.controllers";
const router = express.Router();

router.post("/user", userController.createAdmin);

export const userRoute = router;
