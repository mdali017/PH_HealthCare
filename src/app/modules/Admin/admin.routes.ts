import express, { NextFunction, Request, Response } from "express";
import { adminController } from "./admin.controllers";
import { AnyZodObject, z } from "zod";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidationAshemas } from "./admin.validation";
const router = express.Router();

router.get("/", adminController.getAllAdmins);
router.get("/:id", adminController.getAdminById);
router.patch(
  "/:id",
  validateRequest(adminValidationAshemas.update),
  adminController.updateAdmin
);
router.delete("/:id", adminController.DeleteAdmin);
router.delete("/soft/:id", adminController.SoftDeleteAdmin);

export const adminRoute = router;
