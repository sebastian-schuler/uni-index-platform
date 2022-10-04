import { Country, Institution, State, Subject, SubjectType } from "@prisma/client";
import { DetailedCountry, DetailedSubjectType } from "./types/DetailedDatabaseTypes";
import { Searchable } from "./types/UiHelperTypes";

interface LocalizedNameProps {
    lang: string,
    any?: SubjectType | undefined,
    dbTranslated?: Country
    state?: State,
    subject?: Subject,
    institution?: Institution,
    searchable?: Searchable
}

// Take in a database object and return its name in the selected locale
export const getLocalizedName = ({ lang, any, dbTranslated, state, subject, institution, searchable }: LocalizedNameProps): string => {

    const toStr = (name: string | undefined | null): string => name || "";

    if (any !== undefined) {
        if (lang === "de") return toStr(any.name_native);
        else return toStr(any.name_en);

    } else if (dbTranslated !== undefined) {
        const translations = dbTranslated.translations as { [key: string]: string };
        return translations['name_' + lang] ?? dbTranslated.name;

    } else if (state !== undefined) {
        if (lang === "en") return toStr(state.name_en);
        else return state.name_native;

    } else if (subject !== undefined) {
        return toStr(subject.name);

    } else if (institution !== undefined) {
        return toStr(institution.name);

    } else if (searchable !== undefined) {

        if (searchable.type === "Country")
            return toStr(searchable.data.name);
        else if (searchable.type === "SubjectType")
            return toStr(getLocalizedName({ lang, any: searchable.data }));
        else
            return ""

    } else {
        return "";
    }

}

// Take in an array of database objects and return an array of searchable objects
interface GenerateSearchableProps {
    lang: string | undefined
    array: { type: "Country", data: DetailedCountry[] } | { type: "SubjectType", data: DetailedSubjectType[] }
}
export const generateSearchable = ({ lang, array }: GenerateSearchableProps) => { // TODO add other objects, eg. states
    const locale = lang ?? "en";
    const arr: Searchable[] = [];

    if (array.type === "Country") {
        array.data.forEach((val) => {
            const newSearchable: Searchable = { type: "Country", visible: false, data: val }
            arr.push(newSearchable);
        });
    } else if (array.type === "SubjectType") {
        array.data.forEach((val) => {
            const newSearchable: Searchable = { type: "SubjectType", visible: false, data: val }
            arr.push(newSearchable);
        });
    }
    return arr;
}

// Database only contains Englisch and Native Columns, this function returns English in case another locale is selected (e.g. spanish)
export const getDBLocale = (locale: string | undefined) => {
    if (locale !== "en" && locale !== "native") return "en";
    else return "" + locale;
}

// Generate a static link from given parameters
export const toLink = (...args: string[]) => {
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