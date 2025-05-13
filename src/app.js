import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
import userRouter from "./routes/user.route.js";
app.use("/api/v2/user", userRouter);
import todoRouter from "./routes/todo.route.js";
app.use("/api/v2/todo", todoRouter);
export default app;
