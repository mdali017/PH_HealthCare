import { Doctor } from "@prisma/client";
import catchAsync from "../../../shared/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import { DoctorService } from "./doctor.service";

const updateDoctorData = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.updatedoctorDataIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor data updated successfully",
    data: result,
  });
});

export const DoctorController = {
  updateDoctorData,
};
