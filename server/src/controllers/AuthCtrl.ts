import {Request, Response} from "express";
import {detectRobot, getUserDetails, migrateDate} from "../utils";
import Client from "../orm/entity/Client";
import {AppDataSource} from "../orm/data-source";
import crypto from "crypto";
import {FileRating, ReviewRating} from "../orm/entity/Rating";

export const authenticate = async (req: Request, res: Response) => {
    const body = req.body;

    const userDetails = getUserDetails(req);
    console.log(userDetails)

    if (!userDetails.ip || !userDetails.user_agent) {
        res.status(400).json({error: "Missing user details"});
        return;
    }
    console.log("111")

    if (detectRobot(userDetails.user_agent)) {
        res.status(200).json({
            clientKey: process.env.CRALWER_SESSION_KEY
        });
        return;
    }
    const clientRepository = AppDataSource.getRepository(Client);

    const client = new Client();
    client.client_key = crypto.randomUUID();
    client.ip_address = userDetails.ip;
    client.user_agent = userDetails.user_agent;
    client.visits = [];
    client.last_active = new Date();
    await clientRepository.save(client);

    if (body.migrationData) {
        await migrateDate(client, clientRepository, body.migrationData);
    }

    return res.status(200).json({clientKey: client.client_key});

}

export const getProfile = async (req: Request, res: Response) => {
    const clientKey = req.query.clientKey as string;

    const userDetails = getUserDetails(req);

    if (!clientKey || !userDetails.ip || !userDetails.user_agent) {
        res.status(400).json({error: "Missing user details"});
        return;
    }

    if (clientKey === process.env.CRALWER_SESSION_KEY || detectRobot(userDetails.user_agent)) {
        return res.status(200).json({
            profile: {
                visits: [],
                filesRating: [],
                reviewsRating: []
            }
        });
    }

    const clientRepository = AppDataSource.getRepository(Client);
    const client = await clientRepository.findOne({
        where: {client_key: clientKey},
        relations: ["ratings"]
    });

    if (!client) {
        res.status(400).json({error: "Invalid client key"});
        return;
    }

    res.status(200).json({
        profile: {
            visits: client.visits,
            filesRating: client.ratings.filter(r => r instanceof FileRating),
            reviewsRating: client.ratings.filter(r => r instanceof ReviewRating)
        }
    });
}
