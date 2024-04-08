import express, { Application, Request, Response } from "express";
import cors from "cors";

import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { AuthRoutes } from "./app/modules/Auth/auth.routes";
import { FoundItemCategoryRoutes } from "./app/modules/Found-item-categories/Found-item-categories.routes";
import { FoundItemsRoutes } from "./app/modules/Found-Item/found-Item.routes";
import { ClaimRoutes } from "./app/modules/Claim/claim.route";
import { userRoutes } from "./app/modules/User/user.routes";

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", AuthRoutes);
app.use("/api", FoundItemCategoryRoutes);
app.use("/api", FoundItemsRoutes);
app.use("/api", ClaimRoutes);
app.use("/api", userRoutes);

app.use(globalErrorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Lost and Found System............",
  });
});

export default app;
