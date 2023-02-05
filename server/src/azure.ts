import {
    BlobServiceClient,
    ContainerClient,
    ContainerSASPermissions,
    generateBlobSASQueryParameters,
    SASQueryParameters,
    StorageSharedKeyCredential
} from "@azure/storage-blob";

let blobService: BlobServiceClient;
let containerClient: ContainerClient;

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!(containerName && accountName)) {
    throw Error('Missing configurations for Azure.');
}

const storageUrl = `https://${accountName}.blob.core.windows.net/${containerName}`;

export const loadAzure = async () => {
    blobService = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/`, getKeyCredential())
    containerClient = blobService.getContainerClient(containerName);
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

export const getFileURL = (blobName: string, token: string) => {
    return `${storageUrl}/${blobName}?${token}`;
}

export const uploadBlob = async (fileName: string, filePath: string, mimeType: string) => {
    const blobName = getBlobName(fileName);

    const blobClient = containerClient.getBlockBlobClient(blobName);

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

export const generateToken = (ipAddress: string): SASQueryParameters => {

    const expiry = new Date();
    //expiry.setMonth(expiry.getMonth() + 3); // three month from now (basically one semester)
    expiry.setHours(expiry.getHours() + 2); // three month from now (basically one semester)

    // todo remove exclamation mark
    return generateBlobSASQueryParameters({
        expiresOn: expiry,
        ipRange: {start: ipAddress},
        containerName: containerName,
        permissions: ContainerSASPermissions.parse("r"),
    }, getKeyCredential()!);

}