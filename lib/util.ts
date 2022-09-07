import { Country, Institution, State, Subject, SubjectType } from "@prisma/client";
import { DetailedCountry } from "./types/DetailedDatabaseTypes";
import { Searchable } from "./types/UiHelperTypes";

type LocalizedNameProps = {
    lang: string,
    any?: SubjectType | undefined,
    dbTranslated?: Country
    state?: State,
    subject?: Subject,
    institution?: Institution,
    searchable?: Searchable
}

// Take in a database object and return its name in the selected locale
export const getLocalizedName = ({ lang, any, dbTranslated, state, subject, institution, searchable }: LocalizedNameProps) => {

    if (any !== undefined) {
        if (lang === "de") return "" + any.name_de;
        else return "" + any.name_en;

    } else if (dbTranslated !== undefined) {
        const translations = dbTranslated.translations as { [key: string]: string };
        return translations['name_' + lang] ?? dbTranslated.name;

    } else if (state !== undefined) {
        if (lang === "en") return "" + state.name_en;
        else return state.name_native;

    } else if (subject !== undefined) {
        return "" + subject.name;

    } else if (institution !== undefined) {
        return "" + institution.name;

    } else if (searchable !== undefined) {
        return "" + searchable.data.name; // TODO might have to check type of data

    } else {
        return "";
    }

}

// Take in an array of database objects and return an array of searchable objects
export const generateSearchable = (lang: string | undefined, array: DetailedCountry[]) => { // TODO add other objects, eg. states
    const locale = lang ?? "en";
    const arr: Searchable[] = [];
    array.forEach((val) => {
        const name = getLocalizedName({ lang: locale, dbTranslated: val });
        arr.push({ visible: true, data: val });
    });
    return arr;
}

// Database only contains Englisch and Native Columns, this function returns English in case another locale is selected (e.g. spanish)
export const getDBLocale = (locale: string | undefined) => {
    if (locale !== "en" && locale !== "native") return "en";
    else return "" + locale;
}

// Generate a static link from given parameters
export const toLink = (...args: any[]) => {
    let res = "";
    args.forEach((val) => {
        if (val !== undefined)
            res = res + "/" + val;
    });
    return res;
}

// Add a parameter to a combined string of parameters to build a URL for APIs
export const addParameter = (parameterName: string, newParameter: string | string[] | undefined, parameters: string, defaultValue?: string | number | boolean) => {

    if (newParameter === undefined && defaultValue === undefined) return parameters;
    if (newParameter === undefined && defaultValue !== undefined) newParameter = defaultValue.toString();

    if (parameters !== "") {
        parameters += "&" + parameterName + '=' + newParameter;
    } else {
        parameters += "" + parameterName + '=' + newParameter;
    }

    return parameters;
}

// Add days to a date and return
export const addDays = (date: Date, days: number) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Combine classnames into one
export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}