import { Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constants";
import sendResponse from "../../../shared/sendResponse";

const createAdmin = async (req: Request, res: Response, next: unknown) => {
  //  console.log(req.body)

  try {
    const result = await userService.createAdmin(req);

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: err.name || "Something went wrong",
      error: err,
    });
  }
};

const createDoctor = async (req: Request, res: Response, next: unknown) => {
  //  console.log(req.body)

  try {
    const result = await userService.createDoctor(req);

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: result,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: err.name || "Something went wrong",
      error: err,
    });
  }
};

const createPatient = async (req: Request, res: Response, next: unknown) => {
  //  console.log(req.body)

  try {
    const result = await userService.createPatient(req);

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: result,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: err.name || "Something went wrong",
      error: err,
    });
  }
};

const getAllUsers: RequestHandler = catchAsync(async (req, res) => {
  //   console.log(req.query);

  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await userService.getAllUsersFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile status changed successfully",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  changeProfileStatus,
};
