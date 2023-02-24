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
            url: string
            Country: Country
        }
    }
    Institution: Institution;
    SubjectHasSubjectTypes: (SubjectHasSubjectTypes & {
        SubjectType: SubjectType
    })[]
});

// SUBJECT TYPE CARD
export type DetailedSubjectType = SubjectType & {
    subjectCount: number;
};

// INSTITUTION CARD
export type DetailedInstitution = (Institution & {
    City: City & {
        State: State & {
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

// COUNTRY CARD
export type DetailedCountry = Country & {
    institutionCount: number;
    subjectCount: number;
};

// STATE CARD
export type DetailedState = State & {
    Country: {
        url: string;
    };
    City: {
        _count: {
            Subject: number;
        }
    }[];
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