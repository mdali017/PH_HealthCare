import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JwtHelpers } from "../../../helpars/jwtHelpers";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: "ACTIVE",
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password is incorrect");
  }

  const accessToken = JwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "secret",
    "15m"
  );
  // console.log({ accessToken });

  // refresh token
  const refreshToken = JwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "secret1234",
    "30d"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData: any;
  try {
    // console.log({ token });
    decodedData = JwtHelpers.verifyToken(token, "secret1234");
    console.log({ decodedData });
  } catch (error) {
    throw new Error("Refresh token is invalid");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: "ACTIVE",
    },
  });

  const accessToken = JwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "secret",
    "15m"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const AuthServices = {
  loginUser,
  refreshToken,
};
