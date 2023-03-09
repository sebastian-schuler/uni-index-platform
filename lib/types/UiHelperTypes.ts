export type Searchable = {
    type: "Country"
    visible: boolean,
    data: CountryCardData
} | {
    type: "Category"
    visible: boolean,
    data: CategoryCardData
} | {
    type: "State"
    visible: boolean,
    data: StateCardData
} | {
    type: "City"
    visible: boolean,
    data: CityCardData
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

export type InstitutionCardData = {
    mainCountryId: string
    mainStateId: string
    Institution: {
        url: string
        name: string
        nameBrackets: string
        City: {
            name: string
            url: string
        }
    }
    campusCount: number
    subjectCount: number
    biggestCategories: {
        name: string
        url: string
    }[]
    InstitutionSocialMedia: {
        facebook_url: string | null
        twitter_url: string | null
        instagram_url: string | null
        youtube_url: string | null
    } | null
};


export type SubjectCardData = {
    id: string
    countryId: string
    url: string
    categories: {
        name: string
        url: string
    }[]
    name: string
    degree: string
    duration: number
    durationType: string
    Institution: {
        name: string
        url: string
    },
    City: {
        name: string
        fullUrl: string
    },
};

export type StateCardData = {
    id: string
    name: string
    url: string
    cityCount: number
    subjectCount: number
    popularity: number
}

export type CityCardData = {
    id: string
    name: string
    fullUrl: string
    areaCodes: string[]
    institutionCount: number
    popularity: number
}