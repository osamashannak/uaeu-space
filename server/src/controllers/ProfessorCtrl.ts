import {Request, Response} from 'express';
import {AppDataSource} from "../orm/data-source";
import {Professor} from "../orm/entity/Professor";
import {Equal} from "typeorm";


type ProfessorFindBody = {
    email: string
}

export const rate = async (req: Request, res: Response) => {
    const body = req.body;

    /**
     * TODO uploading file to the mongodb db
     * expected para:
     * course
     * file bin
     */
}

export const getRating = async (req: Request, res: Response) => {

    const body: ProfessorFindBody = req.body;


    const professor = await AppDataSource.getRepository(Professor).findOne({where: {email: Equal(body.email)}, relations: ["reviews"]});


    if (professor === null) {
        res.status(404).json({error: "ProfessorBlock not found."});
        return;
    }

    res.status(200).json({reviews: professor.reviews || []});

}

export const find = async (req: Request, res: Response) => {

    const params = req.query;

    console.log(params)

    const professor = await AppDataSource.getRepository(Professor).findOne({where: {email: Equal(params.email!.toString())}, relations: ["reviews"]});

    if (professor === null) {
        res.status(404).json({error: "ProfessorBlock not found."});
        return;
    }

    res.status(200).json({professor: professor});

}