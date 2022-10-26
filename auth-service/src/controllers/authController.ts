import { Request, Response } from "express";
import { BadRequestError } from "../errors";

const authController = {
    login: async (req: Request, res: Response) => {
        try {
            const { name, country } = req.body;

            if(!name || !country) {
                throw new BadRequestError("Missing parameters in req.body");
            }

            

        } catch (error) {
            if(error instanceof BadRequestError) {
                res.json({ error: error });
            }
        }
    } 
};

export default authController;
