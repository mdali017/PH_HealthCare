import express from "express";
import { adminController } from "./admin.controllers";
const router = express.Router();

router.get("/", adminController.getAllAdmins);

export const adminRoute = router;
