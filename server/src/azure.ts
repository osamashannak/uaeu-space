import {
    BlobServiceClient,
    ContainerClient,
    ContainerSASPermissions,
    generateBlobSASQueryParameters,
    SASQueryParameters,
    StorageSharedKeyCredential
} from "@azure/storage-blob";
import * as crypto from "crypto";

let blobService: BlobServiceClient;
let materialsClient: ContainerClient;
let attachmentsClient: ContainerClient;

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const materialsContainer = process.env.AZURE_STORAGE_CONTAINER_MATERIALS;
const attachmentsContainer = process.env.AZURE_STORAGE_CONTAINER_ATTACHMENTS;

if (!(materialsContainer && accountName && attachmentsContainer)) {
    console.log(accountName);
    console.log(materialsContainer);
    console.log(attachmentsContainer);
    throw Error('Missing configurations for Azure.');
}

const storageUrl = (container: string) => `https://${accountName}.blob.core.windows.net/${container}`;

export const loadAzure = async () => {
    blobService = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/`, getKeyCredential())
    materialsClient = blobService.getContainerClient(materialsContainer);
    attachmentsClient = blobService.getContainerClient(attachmentsContainer);
}

const getBlobName = (originalName: string) => {
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalName}`;
};


const getKeyCredential = () => {
    const accountKey1 = process.env.AZURE_STORAGE_ACCOUNT_KEY1;
    const accountKey2 = process.env.AZURE_STORAGE_ACCOUNT_KEY2;
    if (!(accountKey1 && accountKey2)) return;
    return new StorageSharedKeyCredential(accountName, accountKey1 || accountKey2);
}

export const getFileURL = (blobName: string, container: "attachments" | "materials", token: string="") => {
    return `${storageUrl(container)}/${blobName}?${token}`;
}


export const uploadMaterial = async (fileName: string, filePath: string, mimeType: string) => {
    const blobName = getBlobName(fileName);

    const blobClient = materialsClient.getBlockBlobClient(blobName);

    if (mimeType.includes("video")) {
        mimeType = "";
    }

    const response = await blobClient.uploadFile(filePath, {
        blobHTTPHeaders: {
            blobContentType: mimeType,
            blobCacheControl: 'max-age=31536000, immutable',
            blobContentEncoding: 'gzip'
        }
    });

    console.log(response);

    return blobName;
}

export const uploadAttachment = async (file: Buffer, mimeType: string) => {
    const blobName = crypto.randomUUID();

    const blobClient = attachmentsClient.getBlockBlobClient(blobName);

    const response = await blobClient.uploadData(file, {
        blobHTTPHeaders: {
            blobContentType: mimeType,
            blobCacheControl: 'max-age=31536000, immutable'
        }
    });

    console.log(response);

    return blobName;
}

export const generateToken = (ipAddress: string, container: string): SASQueryParameters => {

    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 3); // three month from now (basically one semester)
    //expiry.setHours(expiry.getHours() + 2); // two hours from now (for development)

    return generateBlobSASQueryParameters({
        expiresOn: expiry,
        ipRange: {start: ipAddress, end: ipAddress},
        containerName: container,
        permissions: ContainerSASPermissions.parse("r"),
    }, getKeyCredential()!);

}