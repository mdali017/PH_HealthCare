import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SpecialtiesService } from "./specialties.service";

const lnsertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.InsertIntoDB(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Specialties created in successfully",
    data: result,
  });
});

export const SpecialtiesController = {
  lnsertIntoDB,
};
