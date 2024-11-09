import { Prisma, PrismaClient } from "@prisma/client";
import { equal } from "assert";
import { adminSearchAbleFields } from "./admin.constant";
import { paginationHelpers } from "../../../helpars/paginationHelper";
import prisma from "../../../shared/prisma";

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

const getAllAdminsFromDB = async (params: any, options: any) => {
  // console.log(params);
  // const { limit, page } = options;
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
          equals: filterData[key], // Fixed the property name
        },
      })),
    });
  }

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
  return result;
};

export const adminService = {
  getAllAdminsFromDB,
};
