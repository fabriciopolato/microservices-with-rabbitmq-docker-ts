import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import logger from "morgan";
import authRouter from "./routes";
import "dotenv/config";
import dbConnect from "./config/db";

(async () => {
    const app = express();
    console.log("ola ola");
    app.use(logger("dev"));
    app.use(express.json());

    try {
        await dbConnect();
    } catch (err) {
        return console.log(err);
    }
  
    app.use("/v1/auth", authRouter);

    app.use((req: Request, res: Response, next: NextFunction) => {
        next(createError(404));
    });
  
    app.listen(process.env.PORT, () => {     
        console.log(`Listening on port ${process.env.PORT}`);
    });
})();
