import { Prisma } from "@prisma/client"

export type SearchResult = {
    type: "country"
    name: string
    url: string
} | {
    type: "state"
    name: string
    url: string
    countryName: string
    countryUrl: string
} | {
    type: "city"
    name: string
    url: string
    stateName: string
    stateUrl: string
    countryName: string
    countryUrl: string
} | {
    type: "institution"
    name: string
    url: string
    countryUrl: string
    countryName: string
} | {
    type: "subject"
    name: string
    url: string
    institutionUrl: string
    institutionName: string
    countryUrl: string
    countryName: string
}
    
export type SearchedStateResult = {
    name_native: string
    name_en: string
    url: string
    countryUrl: string
    countryName: string
}

export type SearchedCityResult = {
    name: string
    url: string
    postcodes: string[]
    stateUrl: string
    stateNameEn: string
    stateNameNative: string
    countryUrl: string
    countryName: string
}

export type SearchedInstitutionResult = {
    name: string
    url: string
    countryUrl: string
    countryName: string
}

export type SearchedSubjectResult = {
    name: string
    url: string
    institutionUrl: string
    institutionName: string
    countryUrl: string
    countryName: string
}