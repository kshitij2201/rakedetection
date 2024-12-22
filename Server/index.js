import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config({
    path: "./.env",
});

const app = express();
const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;

app.use(express.json());
app.use(cors())


import userRouter from "./Routes/auth.route.js";
import rakeRouter from "./Routes/form.route.js";
import wagonRouter from "./Routes/wagon.route.js";

app.use("/api/v1/user", userRouter)
app.use("/api/v2/rake", rakeRouter);
app.use("/api/v3/wagon", wagonRouter);


mongoose
  .connect(mongoUrl)
  .then(() => app.listen(port))
  .then(() => console.log(`connected to port ${port}`))
  .catch((err) => console.log(err.message));


// updated with the code 
