import {OAuth2Client} from "google-auth-library";
import {Request, Response} from 'express';
import {User} from "../orm/entity/user/User";
import {AppDataSource} from "../orm/data-source";
import {verifyHash} from "../sensitive/hashing";
import crypto from "crypto";
import {UserSession} from "../orm/entity/user/UserSession";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface LoginPayload {
    id: string;
    password: string;
}

export const login = async (req: Request, res: Response) => {
    const body = req.body as LoginPayload;

    if (!body.id || !body.password) {
        res.status(400).send({
            success: false,
            message: "Missing username or password"
        });
        return;
    }

    let user = await AppDataSource.getRepository(User).findOne({
        where: [
            {username: body.id},
            {email: body.id}
        ]
    });

    const password = body.password;

    const passwordMatch = await verifyHash(password, user?.password.salt ?? "", user?.password.hash ?? "");

    if (!passwordMatch) {
        res.status(401).send({
            success: false,
            message: "Invalid username or password."
        });
        return;
    }

    const randomToken = crypto.randomBytes(32).toString('hex');

    const sessionRepo = AppDataSource.getRepository(UserSession);

    const session = new UserSession();

    session.token = randomToken;
    session.user = user!;

    await sessionRepo.save(session);

    res.cookie('token', randomToken, {httpOnly: true}).send();

}

export const googleAuth = async (req: Request, res: Response) => {


}

export const forgotPassword = async (req: Request, res: Response) => {
    // get email from body

    const email = req.body.email as string;

    if (!email) {
        res.status(400).send({
            success: false,
            message: "Missing email"
        });
        return;
    }

    res.status(200).send({
        message: "Email has been sent if user exists"
    });


    const user = await AppDataSource.getRepository(User).findOne({
        where: {email: email}
    });

    if (!user) return;

    const randomToken = crypto.randomBytes(32).toString('hex');

    // encrypt the token


}