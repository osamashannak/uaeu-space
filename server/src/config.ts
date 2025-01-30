import dotenv from "dotenv";
dotenv.config();

export const config = {
    PORT: process.env.PORT,
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN as string,
    database: {
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        name: process.env.POSTGRES_DB,
    },
    azure: {
        storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
        storageKey: process.env.AZURE_STORAGE_ACCOUNT_KEY1,
        visionKey: process.env.AZURE_VISION_KEY,
        visionEndpoint: process.env.AZURE_VISION_ENDPOINT,
        materialsContainer: process.env.AZURE_STORAGE_CONTAINER_MATERIALS,
        attachmentsContainer: process.env.AZURE_STORAGE_CONTAINER_ATTACHMENTS,
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        apiKey: process.env.GOOGLE_API_KEY,
        googleRecaptchaSecret: process.env.GOOGLE_RECAPTCHA_SECRET,
    },
    virusTotal: {
        apiKey: process.env.VIRUSTOTAL_API_KEY,
        endpoint: process.env.VIRUSTOTAL_ENDPOINT,
    }
}