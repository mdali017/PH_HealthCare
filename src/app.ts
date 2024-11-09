import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRoute } from "./app/modules/User/user.routes";
import { adminRoute } from "./app/modules/Admin/admin.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", userRoute);
app.use("/api/v1/admin", adminRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("PH Health Care... !");
});

export default app;

//  Video Number 59-06 : Time: 00: 00: 00
