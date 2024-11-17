import express from "express";
import path from "path";
import { userRoute } from "../modules/User/user.routes";
import { adminRoute } from "../modules/Admin/admin.routes";
import { AuthRoute } from "../modules/Auth/auth.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/admin",
    route: adminRoute,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
