import express from "express";
import dotenv from "dotenv";
import { router } from "./router.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
import databaseConnection from "./config/databaseConnection.js";
dotenv.config();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // If using cookies/auth
  })
);
databaseConnection(process.env.DATABASE_LINK)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

app.use("/", router);

app.listen(4000, () => {
  console.log("server is running");
});
