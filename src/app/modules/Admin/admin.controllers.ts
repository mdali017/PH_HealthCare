import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { ParsedQs } from "qs";
import { adminFilterableFields } from "./admin.constant";
import pick from "../../../shared/pick";

const getAllAdmins = async (req: Request, res: Response) => {
  //   console.log(req.query);

  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    console.log({ options });
    const result = await adminService.getAllAdminsFromDB(filters, options);
    res.status(200).json({
      success: true,
      message: "Admins fetched successfully",
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

export const adminController = {
  getAllAdmins,
};
