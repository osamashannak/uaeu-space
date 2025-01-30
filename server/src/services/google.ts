import {config} from "../config";


export class GoogleClient {

    private readonly API_KEY;
    private readonly RECAPTCHA_SECRET;

    constructor() {
        if (config.google.apiKey === undefined) {
            throw new Error('GOOGLE_API_KEY is not set');
        }

        this.API_KEY = config.google.apiKey;

        if (config.google.googleRecaptchaSecret === undefined) {
            throw new Error('GOOGLE_RECAPTCHA_SECRET is not set');
        }

        this.RECAPTCHA_SECRET = config.google.googleRecaptchaSecret;

        console.log("Google client initialized.")
    }

    createAssessment = async (token: string) => {
        let response;

        try {
            const request = await fetch(`https://recaptchaenterprise.googleapis.com/v1/projects/uaeu-space/assessments?key=${this.API_KEY}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event: {
                        token: token,
                        siteKey: this.RECAPTCHA_SECRET,
                        expectedAction: "new_review"
                    }
                })
            });
            response = await request.json();
        } catch (error) {
            return false;
        }

        if (response.error || !response.tokenProperties?.valid || response.tokenProperties?.action !== "new_review") {
            return false;
        }

        return response.riskAnalysis?.score > 0.5;

    }

}