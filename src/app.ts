import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRoute } from "./app/modules/User/user.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", userRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("PH Health Care... !");
});

export default app;

//  Video Number 58-09 : Time: 05: 03: 00
