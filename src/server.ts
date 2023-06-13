import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "@/helpers";
import { mongooseConnect } from "@/config";
import {
  UserRouter,
  PingRouter,
  CompanyRouter,
  ProfileRouter,
  AnalyticsRouter,
  RequestCompanyRouter,
  RateRouter,
  RequestDeliveryRouter,
  RequestAccountRouter,
  AccountRouter,
  TransactionRouter,
  CardRouter,
} from "@/router/api";

import { RootRender } from "@/router/public";
import path from "path";

const PORT: number = +env("PORT");
const DB_URL = env("DB_URL");

if (!PORT || !DB_URL) {
  console.error("Missing env!");
  process.exit(1);
}

export const app = express();

app.use(morgan("combined"));

app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + "/public")));

app.use("/api", [
  PingRouter,
  UserRouter,
  CompanyRouter,
  ProfileRouter,
  AnalyticsRouter,
  RequestCompanyRouter,
  RateRouter,
  RequestDeliveryRouter,
  RequestAccountRouter,
  AccountRouter,
  TransactionRouter,
  CardRouter,
]);

app.get("*", RootRender);

app
  .listen(PORT, () => {
    console.log(`Server started on port ${PORT}: http://localhost:${PORT}`);
    mongooseConnect({ db: DB_URL });
  })
  .on("error", (err) => {
    console.log("ERROR: ", err);
  });

declare module "express" {
  export interface Request {
    user?: {
      _id: string;
      phone: string;
    };
  }
}
