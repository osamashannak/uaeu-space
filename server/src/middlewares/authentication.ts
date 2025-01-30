import {NextFunction, Request, Response} from "express";
import {AppDataSource} from "../app";
import {Guest} from "@spaceread/database/entity/user/Guest";

export const getCredentials = async (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://spaceread.net');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    const token: string | undefined = req.cookies.gid;

    if (!token) {
        return next();
    }

    try {
        const guest = await AppDataSource.getRepository(Guest).findOne({
            where: { token },
            relations: ["course_files", "reviews", "review_rating"],
        });

        if (guest) {
            res.locals.user = guest;
        }
    } catch (error) {
        res.status(500).json({error: "Internal server error"});
        return;
    }

    next();
}
