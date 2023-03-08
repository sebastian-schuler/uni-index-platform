import { Country, State } from "@prisma/client"
import { SearchedCityResult, SearchedInstitutionResult, SearchedStateResult, SearchedSubjectResult, SearchResult } from "../types/SearchTypes"
import { URL_LOCATION } from "../url-helper/urlConstants"
import { getLocalizedName, toLink } from "./util"

export const convertCountryToSearchResult = (country: Country, lang: string): SearchResult => {
    return {
        name: getLocalizedName({ lang: lang, dbTranslated: country }),
        url: country.url,
        type: "country"
    }
}

export const convertStateToSearchResult = (state: SearchedStateResult, lang: string): SearchResult => {
    return {
        type: "state",
        name: getLocalizedName({ lang: lang, state: state }),
        url: state.url,
        countryName: state.countryName,
        countryUrl: state.countryUrl
    }
}

export const convertCityToSearchResult = (city: SearchedCityResult, lang: string): SearchResult => {
    return {
        type: "city",
        name: city.name,
        url: city.url,
        stateName: lang === "en" ? city.stateNameEn : city.stateNameNative,
        stateUrl: city.stateUrl,
        countryName: city.countryName,
        countryUrl: city.countryUrl
    }
}

export const convertInstitutionToSearchResult = (institution: SearchedInstitutionResult, lang: string): SearchResult => {
    return {
        type: "institution",
        name: institution.name,
        url: institution.url,
    }
}

export const convertSubjectToSearchResult = (subject: SearchedSubjectResult, lang: string): SearchResult => {
    return {
        type: "subject",
        name: subject.name,
        url: subject.url,
        institutionName: subject.institutionName,
        institutionUrl: subject.institutionUrl,
        countryName: subject.countryName,
        countryUrl: subject.countryUrl
    }
}