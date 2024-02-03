import * as fs from "fs";
import {promisify} from "util";
import {scheduleJob} from "node-schedule";
import axios from "axios";
import FormData from "form-data";
import {AppDataSource} from "./app";
import {CourseFile} from "@spaceread/database/entity/course/CourseFile";

const unlinkAsync = promisify(fs.unlink);


enum ServiceNeeded {
    FILE_UPLOAD,
    FILE_ANALYSIS
}

export default class VirusTotalClient {

    private readonly ENDPOINT: string = 'https://www.virustotal.com/api/v3';
    private readonly API_KEY?: string = process.env.VIRUSTOTAL_API_KEY;
    private readonly QUEUE: { filePath?: string, blobName: string, serviceNeeded: ServiceNeeded, vtId?: string }[];
    private readonly MINUTE_LIMIT: number = 4;
    private readonly DAILY_LIMIT: number = 500;

    private dailyUsed: number = 0;
    private minuteUsed: number = 0;

    private filesInProcess: number = 0;

    constructor() {
        if (this.API_KEY == undefined) {
            throw new Error('VIRUSTOTAL_API_KEY is not set');
        }

        this.QUEUE = [];


        scheduleJob({hour: 0, minute: 0, tz: "Etc/UTC"}, () => {
            this.resetDailyLimit();
        });

        scheduleJob({second: 0, tz: "Etc/UTC"}, () => {
            this.resetMinuteLimit();
        });

        setInterval(this.queueScheduler.bind(this), 3000);

        console.log("VirusTotal client initialized.")

        process.on('SIGINT', () => {
            if (this.filesInProcess > 0) {
                console.log("Queue is in progress. Please wait.");
                setTimeout(() => {
                    if (this.filesInProcess > 0) return;

                    console.log("Queue is empty. Exiting...")

                    process.exit(1);
                }, 3000);
            }
        });

    }

    private queueScheduler() {
        if (this.QUEUE.length < 1 || !this.canUseApi()) return;

        console.log("Queue size: " + this.QUEUE.length)

        const element = this.QUEUE.shift();

        console.log(element)

        if (!element) return;

        switch (element.serviceNeeded) {
            case ServiceNeeded.FILE_UPLOAD:
                this.uploadFile(element.filePath!, element.blobName);
                break;
            case ServiceNeeded.FILE_ANALYSIS:
                this.storeAnalysis(element.blobName, element.vtId!);
                break;
        }
    }

    canAddToQueue(): boolean {
        return this.filesInProcess < 4;
    }

    private resetDailyLimit() {
        this.dailyUsed = 0;
    }

    private resetMinuteLimit() {
        this.minuteUsed = 0;
    }

    private canUseApi(): boolean {
        return this.dailyUsed < this.DAILY_LIMIT && this.minuteUsed < this.MINUTE_LIMIT;
    }

    async addToQueue(filePath: string, blobName: string): Promise<void> {
        this.filesInProcess++;
        this.QUEUE.push({filePath, blobName, serviceNeeded: ServiceNeeded.FILE_UPLOAD});
    }

    private async uploadFile(filePath: string, blobName: string): Promise<void> {

        console.log("Uploading file: " + filePath)

        const bodyFormData = new FormData();

        bodyFormData.append("file", fs.createReadStream(filePath));


        const options = {
            method: 'POST',
            url: this.ENDPOINT + '/files',
            headers: {
                accept: 'application/json',
                'x-apikey': this.API_KEY,
                'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
            },
            data: bodyFormData
        }

        let response;

        try {
            const req = await axios.request(options);
            response = await req.data;
        } catch (error: any) {
            this.QUEUE.push({filePath, blobName, serviceNeeded: ServiceNeeded.FILE_UPLOAD});
            return;
        }

        this.minuteUsed++;
        this.dailyUsed++;

        this.storeAnalysis(blobName, response.data.id);

        await unlinkAsync(filePath);
    }

    private async storeAnalysis(blobName: string, vtId: string): Promise<void> {

        console.log("Storing analysis: " + blobName)

        const options = {
            method: 'GET',
            url: this.ENDPOINT + '/analyses/' + vtId,
            headers: {
                accept: 'application/json',
                'x-apikey': this.API_KEY
            }
        };

        let response;

        try {
            const req = await axios.request(options);
            response = await req.data;
        } catch (error) {
            console.log(error)
            this.QUEUE.push({blobName, serviceNeeded: ServiceNeeded.FILE_ANALYSIS, vtId});
            return;
        }

        const analysis = response.data.attributes;

        if (analysis.status !== "completed") {
            console.log("Analysis not completed yet.")
            this.QUEUE.push({blobName, serviceNeeded: ServiceNeeded.FILE_ANALYSIS, vtId});
            return;
        }

        const results = analysis.stats;

        const fileRepo = AppDataSource.getRepository(CourseFile);

        const courseFile = await fileRepo.findOne({where: {blob_name: blobName}});

        if (!courseFile) return;

        console.log("Analysis completed.")
        this.filesInProcess--;

        courseFile.vt_report = results;

        await fileRepo.save(courseFile);

    }
}