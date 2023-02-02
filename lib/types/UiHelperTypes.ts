export type Searchable = {
    type: "Country"
    visible: boolean,
    data: CountryCardData
} | {
    type: "SubjectType"
    visible: boolean,
    data: SubjectTypeCardData
}

export type CountryCardData = {
    name: string
    url: string
    imgSrc: string
    countryCode: string
    institutionCount: number
    subjectCount: number
    popularity: number
}

export type SubjectTypeCardData = {
    name: string
    url: string
    subjectCount: number
    popularity: number
}

export type SubjectCardData = {
    countryId: string
    fullUrl: string
    subjectTypes: string
    name: string
    degree: string
    duration: number
    durationType: string
    Institution: {
        name: string
    },
    City: {
        name: string
    }
};