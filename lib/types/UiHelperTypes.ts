import { Prisma } from "@prisma/client"

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
    subject_count: number
    popularity: number
}

export type InstitutionCardData = {
    mainCountryId: string
    mainStateId: string
    institution: {
        url: string
        name: string
        nameBrackets: string
        city: {
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
    socialMedia: {
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
    institution: {
        name: string
        url: string
    },
    city: {
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

export type AdCardData = {
    id: string
    fullUrl: string
    title: string
    subtext: string
    description: string | null
    imageUrl: string | null
    type: string
    sizeCost: number
}

export type ArticleCardData = {
    id: string
    url: string
    title: string
    excerpt: string
    imageUrl: string | null
    date: number
    institution: {
        name: string
        url: string
    }
    country: {
        name: string
        url: string
        countryCode: string
    }
}

export type ArticleData = ArticleCardData & {
    content: Prisma.JsonValue
}

// Used for the "Create Ad" page
export type CreateAdLinkType = "link" | "article";

// Used for the "Create Ad" page
export type FromToDateRange = {
    from: number
    to: number
}