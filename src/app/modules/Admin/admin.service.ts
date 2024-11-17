import { Admin, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { equal } from "assert";
import { adminSearchAbleFields } from "./admin.constant";
import { paginationHelpers } from "../../../helpars/paginationHelper";
import prisma from "../../../shared/prisma";
import { IAdminFilterableRequest } from "./admin.interface";

// const prisma = new PrismaClient();

// const calculatePagination = (options: {
//   page?: number;
//   limit?: number;
//   sortBy?: string;
//   sortOrder?: string;
// }) => {
//   const page = Number(options.page) || 1;
//   const limit = Number(options.limit) || 10;
//   const skip = (page - 1) * limit;

//   const sortBy: string = options.sortBy || "createdAt";
//   const sortOrder: string = options.sortOrder || "desc";

//   return {
//     page,
//     limit,
//     skip,
//     sortBy,
//     sortOrder,
//   };
// };

const getAllAdminsFromDB = async (
  params: IAdminFilterableRequest,
  options: any
) => {
  // console.log(params);
  // const { limit, page } = options;
  console.log(options);
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  // console.log({ filterData });

  const andConditions: Prisma.AdminWhereInput[] = [];

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
      OR: adminSearchAbleFields.map((field) => ({
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

  andConditions.push({
    isDeleted: false,
  });

  //   console.dir(andConditions, { depth: "Infinity" });

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

  const result = await prisma.admin.findMany({
    // where: {
    //     name: {
    //         contains: params.searchTerm,
    //         mode: 'insensitive',
    //     }
    // }

    // where: {
    //   OR: [
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
    // },\

    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.admin.count({
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

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  console.log("chekker...");
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.deleteMany({
      where: {
        email: adminDeletedData.email,
      },
    });
    return adminDeletedData;
  });

  return result;
};

const softDeleteFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adminDeletedData;
  });

  return result;
};

export const adminService = {
  getAllAdminsFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
