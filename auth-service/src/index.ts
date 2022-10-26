import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import logger from "morgan";
import indexRouter from "./routes";
import "dotenv/config";
import dbConnect from "./config/db";

const startServer = async () => {
    const app = express();
    
    app.use(logger("dev"));
    app.use(express.json());

    try {
        await dbConnect();
    } catch (err) {
        return console.log(err);
    }
  
    app.use("/v1", indexRouter);

    app.use((req: Request, res: Response, next: NextFunction) => {
        next(createError(404));
    });
  
    app.listen(process.env.PORT, () => {     
        console.log(`Listening on port ${process.env.PORT}`);
    });
};

startServer();
