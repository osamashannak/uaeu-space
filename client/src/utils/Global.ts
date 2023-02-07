import {formatDistance} from "date-fns";
import {ar, enUS} from "date-fns/locale";
import {languages} from "../i18n";

export const dateHumanize = (date: string, language: string) => {
    return formatDistance(new Date(date), Date.now(), {
        includeSeconds: true,
        locale: language === languages.en ? enUS : ar,
        addSuffix: true
    });
}