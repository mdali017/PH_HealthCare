import express from "express";
import { adminController } from "./admin.controllers";
const router = express.Router();

router.get("/", adminController.getAllAdmins);
router.get("/:id", adminController.getAdminById);
router.patch("/:id", adminController.updateAdmin);
router.delete("/:id", adminController.DeleteAdmin);
router.delete("/soft/:id", adminController.SoftDeleteAdmin);

export const adminRoute = router;
