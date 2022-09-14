import { City, Country, Institution, InstitutionLocation, UserAd, State, Subject, SubjectType, User } from "@prisma/client";

// Detailed types contain all information for cards

// AD
export type DetailedUserAd = UserAd & {
    Subject: (Subject & {
        SubjectType: SubjectType;
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
    SubjectType: SubjectType;
});

// SUBJECT TYPE CARD
export type DetailedSubjectType = SubjectType & {
    subjectCount: number;
};

// INSTITUTION CARD
export type DetailedInstitution = (Institution & {
    City: City & {
        State: {
            Country: Country;
        };
    };
    Subject: (Subject & {
        SubjectType: SubjectType;
    })[];
    InstitutionLocation: {
        City: City & {
            State: State & {
                Country: Country;
            };
        };
    }[];
    _count: {
        Subject: number;
    };
});

// COUNTRY CARD
export type DetailedCountry = Country & {
    institutionCount: number;
    subjectCount: number;
};

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