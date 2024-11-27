import { Patient, Prisma, PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { fileUploader } from "../../../helpars/fileUploader";
import { IFile } from "../../Interfaces/file";
import { paginationHelpers } from "../../../helpars/paginationHelper";
import { userSearchAbleFields } from "./user.constants";

const prisma = new PrismaClient();

const createAdmin = async (req: any) => {
  // console.log("file",req.file);
  // console.log("data",req.body.data);

  // console.log(req.body)
  const file: IFile = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);

    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  // console.log({ hashedPassword });

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });

    return createdAdminData;
  });

  // const adminData = {
  //   name: data.admin.name,
  //   email: data.admin.email,
  //   contactNumber: data.admin.contactNumber,
  // };

  return result;
};

const createDoctor = async (req: any) => {
  // console.log("file",req.file);
  // console.log("data",req.body.data);

  // console.log(req.body)
  const file: IFile = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);

    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  // console.log({ hashedPassword });

  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });

    return createdDoctorData;
  });

  // const adminData = {
  //   name: data.admin.name,
  //   email: data.admin.email,
  //   contactNumber: data.admin.contactNumber,
  // };

  return result;
};

const createPatient = async (req: any): Promise<Patient> => {
  // console.log("file",req.file);
  // console.log("data",req.body.data);

  // console.log(req.body)
  const file: IFile = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);

    req.body.patient.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  // console.log({ hashedPassword });

  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdPatientData = await transactionClient.patient.create({
      data: req.body.patient,
    });

    return createdPatientData;
  });

  // const adminData = {
  //   name: data.admin.name,
  //   email: data.admin.email,
  //   contactNumber: data.admin.contactNumber,
  // };

  return result;
};

const getAllUsersFromDB = async (params: any, options: any) => {
  // console.log(params);
  // const { limit, page } = options;
  // console.log(options);
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  // console.log({ filterData });

  const andConditions: Prisma.UserWhereInput[] = [];

  //   [
  //     {
  //       name: {
  //         contains: params.searchTerm,
  //         mode: "insensitive",
  //       },
  //     },
  //     {
  //       email: {
  //         contains: params.searchTerm,
  //         mode: "insensitive",
  //       },
  //     },
  //   ],

  if (params?.searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key], // Fixed the property name
        },
      })),
    });
  }

  // andConditions.push({
  //   isDeleted: false,
  // });

  //   console.dir(andConditions, { depth: "Infinity" });

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            // createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createAt: true,
      updatedAt: true,

      doctor: true,
      patient: true,
      admin: true,
    },
    // include: {
    //   doctor: true,
    //   patient: true,
    //   admin: true,
    // }
  });
  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const changeProfileStatus = async (id: string, status: UserRole) => {
  // console.log(id);
  // console.log(data);

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};

export const userService = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsersFromDB,
  changeProfileStatus,
};
