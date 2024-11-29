import express, { NextFunction, Request, Response } from "express";
import { SpecialtiesController } from "./specialties.controllers";
import { fileUploader } from "../../../helpars/fileUploader";
import { SpecialtiesValidation } from "./specialties.validation";
// import { SpecialtiesValidation } from "./specialties.validation";
const router = express.Router();

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidation.createValidation.parse(
      JSON.parse(req.body.data)
    );
    return SpecialtiesController.lnsertIntoDB(req, res, next);
  }
);

export const SpecialtiesRoutes = router;
