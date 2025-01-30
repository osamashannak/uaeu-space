import express from "express";
import bodyParser from "body-parser";
import {AzureClient} from "./services/azure";
import VirusTotalClient from "./services/virustotal";
import {createDataSource} from "@spaceread/database";
import cookies from "cookie-parser";
import {config} from "./config";
import course_router from "./modules/course/course_router";
import professor_router from "./modules/professor/professor_router";
import {GoogleClient} from "./services/google";
import global_router from "./modules/global/global_router";
import {ProfessorService as ProfService} from "./services/professor";

export let VTClient: VirusTotalClient;
export let Azure: AzureClient;
export let Google: GoogleClient;
export let ProfessorService: ProfService;
export const AppDataSource = createDataSource({
    host: config.database.host,
    username: config.database.user,
    password: config.database.password,
    database: config.database.name,
});

(async function main() {
    const app = express();

    app.use(cookies());
    app.use(bodyParser.urlencoded({extended: true, limit: "100mb"}));
    app.use(bodyParser.json({limit: "100mb"}));

    if (!config.PORT) {
        throw Error("Missing PORT environment variable.");
    }

    if (!config.ALLOWED_ORIGIN) {
        throw Error("Missing ALLOWED_ORIGIN environment variable.");
    }

    app.use("/", global_router);
    app.use("/course", course_router);
    app.use("/professor", professor_router);

    VTClient = new VirusTotalClient();
    Azure = new AzureClient();
    Google = new GoogleClient();
    await AppDataSource.initialize();

    ProfessorService = new ProfService();

    app.listen(config.PORT, () => {
        console.log(`Server is running on port ${config.PORT}`);
    });
})()