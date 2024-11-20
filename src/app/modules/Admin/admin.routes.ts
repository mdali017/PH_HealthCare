import express, { NextFunction, Request, Response } from "express";
import { adminController } from "./admin.controllers";
import { AnyZodObject, z } from "zod";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidationAshemas } from "./admin.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.getAllAdmins
);
router.get("/:id", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), adminController.getAdminById);
router.patch(
  "/:id",
  validateRequest(adminValidationAshemas.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.updateAdmin
);
router.delete("/:id", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), adminController.DeleteAdmin);
router.delete("/soft/:id", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), adminController.SoftDeleteAdmin);

export const adminRoute = router;
