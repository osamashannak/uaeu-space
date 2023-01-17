import {Request, Response} from 'express';
import {ProfessorModel} from "../models/professorModel";


enum FindRequestType {
    Autocomplete,
    Known
}

interface FindRequestBody {
    value: string,
    type: FindRequestType
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

    if (body.type == FindRequestType.Autocomplete) {
        const find = await ProfessorModel.aggregate([
                {$search: {autocomplete: {query: body.value, path: "name"}}},
                {$limit: 5}
            ]
        );

        const found: any[] = [];

        find.forEach(doc => {
            found.push(doc.name);
        })

        results = found;
    } else {
        const find = await ProfessorModel.findOne({
            name: body.value
        });

        if (find == null) {
            res.status(401).json({error: "Name not found."});
            return;
        }

        results = find.profId;
    }

    res.status(200).json({"results": results});
}