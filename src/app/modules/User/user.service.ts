import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const createAdmin = async (data: any) => {
  // console.log({ data });

  const hashedPassword = await bcrypt.hash(data.password, 12);
  // console.log({ hashedPassword });

  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: data.admin,
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

export const userService = {
  createAdmin,
};
