import {Request, Response} from 'express';
import {ProfessorModel} from "../models/ProfessorModel";
import {FindRequestBody, FindRequestType} from "./Interface";


export const rate = async (req: Request, res: Response) => {
    const body = req.body;

    /**
     * TODO uploading file to the mongodb db
     * expected para:
     * course
     * file bin
     */
}

export const getRatings = async (req: Request, res: Response) => {
    /**
     * TODO get all files (approved) that are stored in the db for set course
     * expected para:
     * courseId
     */
}

export const find = async (req: Request, res: Response) => {
    const body: FindRequestBody = req.body;

    let results: any[] | string;

    if (body.type == FindRequestType.AUTOCOMPLETE) {
        const regex = new RegExp(`${req.body.value}`, 'i');
        const find = await ProfessorModel.find({
            name: regex
        }).limit(5);

        const found: any[] = [];

        find.forEach(doc => {
            found.push(doc.name);
        })

        results = found;
    } else if (body.type == FindRequestType.KNOWN) {
        const find = await ProfessorModel.findOne({
            name: body.value
        });

        if (find == null) {
            res.status(401).json({error: "name not found."});
            return;
        }

        results = find.profId;
    } else {
        res.status(401).json({error: "type does not exist."});
        return;
    }

    res.status(200).json({"results": results});
}