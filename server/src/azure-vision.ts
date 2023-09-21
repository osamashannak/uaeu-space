import {ComputerVisionClient} from "@azure/cognitiveservices-computervision";
import {ApiKeyCredentials} from "@azure/ms-rest-js";

const key = process.env.AZURE_VISION_KEY;
const endpoint = process.env.AZURE_VISION_ENDPOINT;

if (!(key && endpoint)) {
    throw Error('Missing configurations for Azure Computer Vision.');
}

const computerVisionClient = new ComputerVisionClient(new ApiKeyCredentials({inHeader: {'Ocp-Apim-Subscription-Key': key}}), endpoint);

export const analyzeImage = async (url: string) => {
    const result = await computerVisionClient.analyzeImage(url,{visualFeatures: ["Adult"]});
    return isSafe(result.adult);
}

const isSafe = (adult: any) => {
    return !adult.isAdultContent && !adult.isRacyContent && !adult.isGoryContent;
}