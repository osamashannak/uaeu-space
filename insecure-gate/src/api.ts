import axios from "axios";

const enpoint = (ip: string) => `https://api.findip.net/${ip}/?token=b09dc3f5a9574c6a80745a3351cf8de1`;

export async function getCountryFromIp(ip: string) {
    let response;

    try {
        response = await axios.get(enpoint(ip));
    } catch (e) {
        return "Unknown";
    }

    if (response.status !== 200) {
        return "Unknown";
    }

    return response.data.country.names.en;
}