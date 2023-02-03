import {
    ContainerSASPermissions,
    generateBlobSASQueryParameters,
    SASQueryParameters,
    StorageSharedKeyCredential
} from "@azure/storage-blob";


const accountName = "uaeuresources"//process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = "materials"//process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!(containerName && accountName)) {
    throw Error('Missing configurations for Azure.');
}

const storageUrl = `https://${accountName}.blob.core.windows.net/${containerName}`;

const getKeyCredential = () => {
    const accountKey1 = process.env.AZURE_STORAGE_ACCOUNT_KEY1;
    const accountKey2 = process.env.AZURE_STORAGE_ACCOUNT_KEY2;
    if (!(accountKey1 && accountKey2)) return;
    return new StorageSharedKeyCredential(accountName, accountKey1 || accountKey2);
}

export const getFileURL = (blobName: string, token: string) => {
    return `${storageUrl}/${blobName}?${token}`;
}


export const uploadBlob = (file: any) => {

}

export const generateToken = (ipAddress: string): SASQueryParameters => {

    const expiry = new Date();
    expiry.setMonth(expiry.getMonth()+3); // three month from now (basically one semester)

     // todo remove exclamation mark
    return generateBlobSASQueryParameters({
        expiresOn: expiry,
        ipRange: {start: ipAddress},
        containerName: containerName,
        permissions: ContainerSASPermissions.parse("r"),
    }, getKeyCredential()!);

}