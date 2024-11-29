import { Request } from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import prisma from "../../../shared/prisma";

const InsertIntoDB = async (req: Request) => {
  //   console.log("Insert Into DB");
  const file = req.file;

  if (file) {
    const uploadToCloudinary: any = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

export const SpecialtiesService = {
  InsertIntoDB,
};
