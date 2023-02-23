export type Searchable = {
    type: "Country"
    visible: boolean,
    data: CountryCardData
} | {
    type: "SubjectType"
    visible: boolean,
    data: CategoryCardData
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

export type CategoryCardData = {
    id: number
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

export type StateCardData = {
    id: string
    name: string
    url: string
    cityCount: number
    subjectCount: number
    popularity: number
}