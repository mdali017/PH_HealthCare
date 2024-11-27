import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controllers";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { userValidation } from "./user.validation";
import { UserRole } from "@prisma/client";
const router = express.Router();

//  =============================
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.getAllUsers
);
//  =============================

router.post(
  "/create-admin",
  auth("ADMIN", "SUPER_ADMIN", "DOCTOR"),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the body after ensuring it's a JSON object
      const parsedBody = JSON.parse(req.body.data);
      req.body = userValidation.createAdmin.parse(parsedBody);
      return userController.createAdmin(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/create-doctor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the body after ensuring it's a JSON object
      const parsedBody = JSON.parse(req.body.data);
      req.body = userValidation.createDoctor.parse(parsedBody);
      return userController.createDoctor(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the body after ensuring it's a JSON object
      const parsedBody = JSON.parse(req.body.data);
      req.body = userValidation.createPatient.parse(parsedBody);
      return userController.createPatient(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.changeProfileStatus
);

export const userRoute = router;
