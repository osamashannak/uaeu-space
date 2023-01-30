import {formatDistance} from "date-fns";
import {ar, enUS} from "date-fns/locale";

export const dateHumanize = (date: string, language: string) => {
    return formatDistance(new Date(date), Date.now(), {
        includeSeconds: true,
        locale: language === "en" ? enUS : ar,
        addSuffix: true
    });
}