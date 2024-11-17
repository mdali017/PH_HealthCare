import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRoute } from "./app/modules/User/user.routes";
import { adminRoute } from "./app/modules/Admin/admin.routes";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import coockieParser from "cookie-parser";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(coockieParser());

// app.use("/api/v1", userRoute);
// app.use("/api/v1/admin", adminRoute);
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("PH Health Care... !");
});

app.use(globalErrorHandler);

// app.use((req: Request, res: Response) => res.status(404).json({ message: "Not Found" })



// }));


export default app;

//  Video Number 59-06 : Time: 00: 00: 00
