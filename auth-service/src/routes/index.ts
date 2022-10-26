import { Router, Request, Response } from "express";
import authController from "../controllers/authController";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.json("auth service is up and running");
});

router.post("/login", authController.login);

export default router;
