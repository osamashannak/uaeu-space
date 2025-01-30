import {
    BlobServiceClient,
    ContainerClient,
    ContainerSASPermissions,
    generateBlobSASQueryParameters,
    SASQueryParameters,
    StorageSharedKeyCredential
} from "@azure/storage-blob";
import {ComputerVisionClient} from "@azure/cognitiveservices-computervision";
import {ApiKeyCredentials} from "@azure/ms-rest-js";
import {config} from "../config";

export class AzureClient {

    static readonly accountName: string = process.env.AZURE_STORAGE_ACCOUNT_NAME!;

    private materialsClient: ContainerClient;
    private attachmentsClient: ContainerClient;

    private computerVisionClient: ComputerVisionClient;

    constructor() {
        if (!config.azure.attachmentsContainer || !config.azure.materialsContainer) {
            throw Error('The Azure container names are not set.');
        }

        const materialsContainer = config.azure.materialsContainer;
        const attachmentsContainer = config.azure.attachmentsContainer;

        const blobService = new BlobServiceClient(`https://${AzureClient.accountName}.blob.core.windows.net/`, this.getKeyCredential())
        this.materialsClient = blobService.getContainerClient(materialsContainer);
        this.attachmentsClient = blobService.getContainerClient(attachmentsContainer);

        if (!config.azure.visionKey || !config.azure.visionEndpoint) {
            throw Error('The Azure Vision configurations are not set.');
        }

        const key = config.azure.visionKey;
        const endpoint = config.azure.visionEndpoint;

        if (!(key && endpoint)) {
            throw Error('Missing configurations for Azure Computer Vision.');
        }

        this.computerVisionClient = new ComputerVisionClient(new ApiKeyCredentials({inHeader: {'Ocp-Apim-Subscription-Key': key}}), endpoint);

        console.log("Azure client initialized.")
    }

    static storageUrl = (container: string) => `https://${AzureClient.accountName}.blob.core.windows.net/${container}`;


    getBlobName(originalName: string) {
        const identifier = Math.random().toString().replace(/0\./, '');
        return `${identifier}-${originalName}`;
    };


    getKeyCredential() {
        const accountKey1 = process.env.AZURE_STORAGE_ACCOUNT_KEY1;
        const accountKey2 = process.env.AZURE_STORAGE_ACCOUNT_KEY2;
        if (!(accountKey1 && accountKey2)) return;
        return new StorageSharedKeyCredential(AzureClient.accountName, accountKey1 || accountKey2);
    }

    static getFileURL = (blobName: string, container: "attachments" | "materials", token: string = "") => {
        return `${AzureClient.storageUrl(container)}/${blobName}?${token}`;
    }

    async uploadMaterial(fileName: string, filePath: string, mimeType: string) {
        const blobName = this.getBlobName(fileName);

        const blobClient = this.materialsClient.getBlockBlobClient(blobName);

        if (mimeType.includes("video")) {
            mimeType = "";
        }

        await blobClient.uploadFile(filePath, {
            blobHTTPHeaders: {
                blobContentType: mimeType,
                blobCacheControl: 'max-age=31536000, immutable',
                blobContentEncoding: 'gzip'
            }
        });

        return blobName;
    }

    async uploadAttachment(blobName: string, file: Buffer, mimeType: string) {

        const blobClient = this.attachmentsClient.getBlockBlobClient(blobName);

        await blobClient.uploadData(file, {
            blobHTTPHeaders: {
                blobContentType: mimeType,
                blobCacheControl: 'max-age=31536000, immutable'
            }
        });

        return blobName;
    }

    generateToken(ipAddress: string, container: string): SASQueryParameters {

        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 3); // three month from now (basically one semester)
        //expiry.setHours(expiry.getHours() + 2); // two hours from now (for development)

        return generateBlobSASQueryParameters({
            expiresOn: expiry,
            ipRange: {start: ipAddress, end: ipAddress},
            containerName: container,
            permissions: ContainerSASPermissions.parse("r"),
        }, this.getKeyCredential()!);
    }

    async analyzeImage(url: string) {
        const result = await this.computerVisionClient.analyzeImage(url,{visualFeatures: ["Adult"]});
        return AzureClient.isSafe(result.adult);
    }

    static isSafe(adult: any) {
        return !adult.isAdultContent && !adult.isRacyContent && !adult.isGoryContent;
    }
}