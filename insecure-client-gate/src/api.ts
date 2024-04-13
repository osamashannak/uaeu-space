import axios from "axios";

const IP_LOOKUP_API = "https://api.iplocation.net";

export async function getCountryFromIp(ip: string) {
    const response = await axios.get(`${IP_LOOKUP_API}/?ip=${ip}`);
    if (response.status !== 200) {
        return "Unknown";
    }
    return response.data.country_name;
}