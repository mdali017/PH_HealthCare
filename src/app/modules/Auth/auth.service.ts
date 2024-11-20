import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { JwtHelpers } from "../../../helpars/jwtHelpers";
import config from "../../../config";
import { UserStatus } from "@prisma/client";
import emailSender from "./emailSender";

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
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );
  // console.log({ accessToken });

  // refresh token
  const refreshToken = JwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expires_in as string
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
    decodedData = JwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as string
    );
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
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  // console.log("chekker...");
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);
  // console.log({ hashedPassword });

  await prisma.user.update({
    where: {
      email: userData.email,
      status: "ACTIVE",
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPassToken = JwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_pass_secret as string,
    config.jwt.reset_pass_expires_in as string
  );

  // console.log({ resetPassToken });

  // http://localhost:3000/reset-pass?email="fahim@ph.com&token=resetPassToken

  const resetPasswordLink =
    config.reset_pass_link + `?user_id=&${userData.id}&token=${resetPassToken}`;
  // console.log({ resetPasswordLink });
  await emailSender(
    userData.email,

    `
   <div>
     <section className="max-w-2xl px-6 py-8 mx-auto bg-white dark:bg-gray-900">
    <header>
        <a href="#">
            <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/full-logo.svg" alt="">
        </a>
    </header>

    <main className="mt-8">
        <h2 className="text-gray-700 dark:text-gray-200">Hi ${userData.id},</h2>

        <p className="mt-2 leading-loose text-gray-600 dark:text-gray-300">
            This is your password reset link:
        </p>

        <a href="${resetPasswordLink}">
          <button>Reset password</button>
        </a>

        <p className="mt-4 leading-loose text-gray-600 dark:text-gray-300">
            This code will only be valid for the next 5 minutes. If the code does not work, you can use this login verification link:
        </p>
        
        <button className="px-6 py-2 mt-6 text-sm font-medium tracking-wider text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
            Verify email
        </button>
        
        <p className="mt-8 text-gray-600 dark:text-gray-300">
            Thanks, <br>
            Meraki UI team
        </p>
    </main>
    

    <footer className="mt-8">
        <p className="text-gray-500 dark:text-gray-400">
            This email was sent to <a href="#" className="text-blue-600 hover:underline dark:text-blue-400" target="_blank">contact@merakiui.com</a>. 
            If you'd rather not receive this kind of email, you can <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">unsubscribe</a> or <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">manage your email preferences</a>.
        </p>

        <p className="mt-3 text-gray-500 dark:text-gray-400">© {{ new Date().getFullYear() }} Meraki UI. All Rights Reserved.</p>
    </footer>
</section>
   </div>`
  );
};

const resetPassword = async (token: string, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = JwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret as string
  );
  console.log({ isValidToken });
  if (!isValidToken) {
    throw new Error("Token is invalid or has expired");
  }
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
