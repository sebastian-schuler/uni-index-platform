import { country, institution, state, subject, subject_category, category } from "@prisma/client";
import { SearchedStateResult } from "../types/SearchTypes";
import { CategoryCardData, CityCardData, CountryCardData, Searchable, StateCardData } from "../types/UiHelperTypes";
import { URL_CATEGORY } from "../url-helper/urlConstants";

interface LocalizedNameProps {
    lang: string,
    any?: category | undefined | null,
    dbTranslated?: country | null
    state?: state | SearchedStateResult | null,
    subject?: subject | null,
    institution?: institution | null,
    searchable?: Searchable | null
}

// Take in a database object and return its name in the selected locale
export const getLocalizedName = ({ lang, any, dbTranslated, state, subject, institution, searchable }: LocalizedNameProps): string => {

    const toStr = (name: string | undefined | null): string => name || "";

    if (any) {
        if (lang === "de") return toStr(any.name_native);
        else return toStr(any.name_en);

    } else if (dbTranslated) {
        const translations = dbTranslated.translations as { [key: string]: string };
        return translations['name_' + lang] ?? dbTranslated.name;

    } else if (state) {
        if (lang === "en") return toStr(state.name_en);
        else return state.name_native;

    } else if (subject) {
        return toStr(subject.name);

    } else if (institution) {
        return toStr(institution.name);

    } else if (searchable) {
        return toStr(searchable.data.name);

    } else {
        return "";
    }

}

// Take in an array of database objects and return an array of searchable objects
type GenerateSearchableProps = {
    type: "Country", data: CountryCardData[]
} | {
    type: "Category", data: CategoryCardData[]
} | {
    type: "State", data: StateCardData[]
} | {
    type: "City", data: CityCardData[]
}
export const generateSearchable = (props: GenerateSearchableProps) => { // TODO add other objects, eg. states
    const arr: Searchable[] = [];

    if (props.type === "Country") {
        props.data.forEach((val) => {
            arr.push({ type: "Country", visible: true, data: val });
        });

    } else if (props.type === "Category") {
        props.data.forEach((val) => {
            arr.push({ type: "Category", visible: true, data: val });
        });

    } else if (props.type === "State") {
        props.data.forEach((val) => {
            arr.push({ type: "State", visible: true, data: val });
        });

    } else if (props.type === "City") {
        props.data.forEach((val) => {
            arr.push({ type: "City", visible: true, data: val });
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
        if (val !== undefined) {
            if (val.startsWith("/")) res += val;
            else res = res + "/" + val;
        }
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

/**
 * Get n amount of unique subject types, ordered by occurences
 * @param param0 
 */
interface LargestSubjectTypeProps {
    list: (
        (subject & {
            subject_category: (subject_category & {
                category: category;
            })[];
        })[]
    );
    lang: string;
    itemCount: number;
}
export const getUniqueCategoryCounts = ({ list, lang, itemCount }: LargestSubjectTypeProps) => {

    // Find all types of subjects
    const typeList: category[] = [];
    for (const item of list) {
        for (const type of item.subject_category) {
            typeList.push(type.category);
        }
    }

    // Count types
    const counts: Map<number, number> = new Map();
    for (const item of typeList) {
        if (counts.has(item.id)) {
            counts.set(item.id, (counts.get(item.id) || 1) + 1);
        } else {
            counts.set(item.id, 1);
        }
    }

    // Sort by count
    const sorted = [...counts].map(([id, count]) => ({ id, count })).sort((a, b) => b.count - a.count);

    // Get the top 3
    const result: {
        name: string
        url: string
    }[] = [];

    for (let i = 0; i < itemCount && i < sorted.length; i++) {
        const category = typeList.find(type => type.id === sorted[i].id);
        if (!category) continue;
        const name = getLocalizedName({ lang: lang, any: category })
        result.push({
            name,
            url: toLink(URL_CATEGORY, category?.url)
        });
    }

    return [...result];
}

type ArrayProps = { type: "Country", data: country[] } | { type: "State", data: state[] } | { type: "SubjectType", data: category[] };
/**
 * Removes duplicates from an array of objects, returns a new array
 * @param props - {type: "Country" | "State" | "SubjectType", data: Country[] | State[] | SubjectType[]}
 */
export const getUniquesFromArray = (props: ArrayProps) => {

    if (props.type === "Country") {

        const uniqueIds: string[] = [];
        return props.data.filter((item) => {
            if (uniqueIds.includes(item.id)) return false;
            else {
                uniqueIds.push(item.id);
                return true;
            }
        });

    } else if (props.type === "State") {

        const uniqueIds: string[] = [];
        return props.data.filter((item) => {
            if (uniqueIds.includes(item.id)) return false;
            else {
                uniqueIds.push(item.id);
                return true;
            }
        });
    } else if (props.type === "SubjectType") {

        const uniqueIds: number[] = [];
        return props.data.filter((item) => {
            if (uniqueIds.includes(item.id)) return false;
            else {
                uniqueIds.push(item.id);
                return true;
            }
        });
    }

}