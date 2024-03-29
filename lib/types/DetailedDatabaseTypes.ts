import { city, country, institution, state, subject, subject_category, category, user_ad } from "@prisma/client";

// Detailed types contain all information for cards

// SUBJECT CARD
export type DetailedSubject = (subject & {
    city: city & {
        state: {
            url: string
            country: country
        }
    }
    institution: institution;
    subject_category: (subject_category & {
        category: category
    })[]
});

// SUBJECT TYPE CARD
export type DetailedSubjectType = category & {
    subject_count: number;
};

// INSTITUTION CARD
export type DetailedInstitution = (institution & {
    city: city & {
        state: state & {
            country: country;
        }
    }
    subject: (subject & {
        subject_category: (subject_category & {
            category: category
        })[]
    })[]
    institution_city: {
        city: city & {
            state: state & {
                country: country
            }
        }
    }[]
    institution_socials: {
        facebook_url: string | null
        twitter_url: string | null
        instagram_url: string | null
        youtube_url: string | null
    } | null
    _count: {
        subject: number
    }
});

// COUNTRY CARD
export type DetailedCountry = country & {
    institutionCount: number;
    subjectCount: number;
};

// STATE CARD
export type DetailedState = state & {
    country: {
        url: string;
    };
    city: {
        _count: {
            subject: number;
        }
    }[];
    _count: {
        city: number;
    };
};

// CITY CARD
export type DetailedCity = city & {
    state: state & {
        country: country
    };
    _count: {
        institution_city: number;
        subject: number;
    };
};