import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import logger from "morgan";
import indexRouter from "./routes";
import "dotenv/config";

const startServer = async () => {
    const app = express();
    
    app.use(logger("dev"));
    app.use(express.json());
  
    app.use("/v1", indexRouter);

    app.use((req: Request, res: Response, next: NextFunction) => {
        next(createError(404));
    });
  
    app.listen(process.env.PORT, () => {     
        console.log(`Listening on port ${process.env.PORT}`);
    });
};

startServer();
