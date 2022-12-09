import { City, Country, Institution, InstitutionLocation, UserAd, State, Subject, SubjectType, User, SubjectHasSubjectTypes } from "@prisma/client";

// Detailed types contain all information for cards

// AD
export type DetailedUserAd = UserAd & {
    Subject: (Subject & {
        SubjectHasSubjectTypes: (SubjectHasSubjectTypes & {
            SubjectType: SubjectType;
        })[];
    }) | null;
    User: User & {
        Institution: Institution & {
            City: City & {
                State: State & {
                    Country: Country;
                };
            };
            InstitutionLocation: (InstitutionLocation & {
                City: City
            })[]
        };
    };
};

// SUBJECT CARD
export type DetailedSubject = (Subject & {
    City: City & {
        State: {
            Country: Country;
        };
    };
    Institution: Institution;
    SubjectHasSubjectTypes: (SubjectHasSubjectTypes & {
        SubjectType: SubjectType;
    })[];
});

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

// SUBJECT TYPE CARD
export type DetailedSubjectType = SubjectType & {
    subjectCount: number;
};

// INSTITUTION CARD
export type DetailedInstitution = (Institution & {
    City: City & {
        State: State &{
            Country: Country;
        }
    }
    Subject: (Subject & {
        SubjectHasSubjectTypes: (SubjectHasSubjectTypes & {
            SubjectType: SubjectType
        })[]
    })[]
    InstitutionLocation: {
        City: City & {
            State: State & {
                Country: Country
            }
        }
    }[]
    InstitutionSocialMedia: {
        facebook_url: string | null
        twitter_url: string | null
        instagram_url: string | null
        youtube_url: string | null
    } | null
    _count: {
        Subject: number
    }
});

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
    biggestSubjectTypes: string[]
    InstitutionSocialMedia: {
        facebook_url: string | null
        twitter_url: string | null
        instagram_url: string | null
        youtube_url: string | null
    } | null
};

// COUNTRY CARD
export type DetailedCountry = Country & {
    institutionCount: number;
    subjectCount: number;
};

export type CountryCardData = {
    name: string
    url: string
    imgSrc: string
    countryCode: string
    institutionCount: number
    subjectCount: number
}

// STATE CARD
export type DetailedState = State & {
    City: City[];
    Country: {
        url: string;
    };
    _count: {
        City: number;
    };
};

// CITY CARD
export type DetailedCity = City & {
    State: State & {
        Country: Country
    };
    _count: {
        InstitutionLocation: number;
        Subject: number;
    };
};