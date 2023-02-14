"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.uploadBlob = exports.getFileURL = exports.loadAzure = void 0;
const storage_blob_1 = require("@azure/storage-blob");
let blobService;
let containerClient;
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
if (!(containerName && accountName)) {
    throw Error('Missing configurations for Azure.');
}
const storageUrl = `https://${accountName}.blob.core.windows.net/${containerName}`;
const loadAzure = () => __awaiter(void 0, void 0, void 0, function* () {
    blobService = new storage_blob_1.BlobServiceClient(`https://${accountName}.blob.core.windows.net/`, getKeyCredential());
    containerClient = blobService.getContainerClient(containerName);
});
exports.loadAzure = loadAzure;
const getBlobName = (originalName) => {
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalName}`;
};
const getKeyCredential = () => {
    const accountKey1 = process.env.AZURE_STORAGE_ACCOUNT_KEY1;
    const accountKey2 = process.env.AZURE_STORAGE_ACCOUNT_KEY2;
    if (!(accountKey1 && accountKey2))
        return;
    return new storage_blob_1.StorageSharedKeyCredential(accountName, accountKey1 || accountKey2);
};
const getFileURL = (blobName, token) => {
    return `${storageUrl}/${blobName}?${token}`;
};
exports.getFileURL = getFileURL;
const uploadBlob = (fileName, filePath, mimeType) => __awaiter(void 0, void 0, void 0, function* () {
    const blobName = getBlobName(fileName);
    const blobClient = containerClient.getBlockBlobClient(blobName);
    const response = yield blobClient.uploadFile(filePath, {
        blobHTTPHeaders: {
            blobContentType: mimeType,
            blobCacheControl: 'max-age=31536000, immutable',
            blobContentEncoding: 'gzip'
        }
    });
    console.log(response);
    return blobName;
});
exports.uploadBlob = uploadBlob;
const generateToken = (ipAddress) => {
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 3); // three month from now (basically one semester)
    //expiry.setHours(expiry.getHours() + 2); // two hours from now (for development)
    return (0, storage_blob_1.generateBlobSASQueryParameters)({
        expiresOn: expiry,
        ipRange: { start: ipAddress },
        containerName: containerName,
        permissions: storage_blob_1.ContainerSASPermissions.parse("r"),
    }, getKeyCredential());
};
exports.generateToken = generateToken;
