import { Country, Institution, UserAd, Subject } from "@prisma/client";

// Type used in getStaticProps on the server
export type InstitutionRegistrationDBItem = {
    id: string;
    name: string;
    User: {
        _count: {
            UserSession: number;
        };
    }[];
};

// Type used on the client on the registration page for the institution picker
export type InstitutionRegistrationItem = {
    id: string;
    name: string;
    hasAccount: boolean;
};

// USER DATA API

export type UserDataResponse = {
    status: "SUCCESS"
    profile?: UserDataProfile
    subjects?: Subject[]
    ads?: PremiumAdDetailed[]
} | { status: "NO_USER" | "NO_AUTH" | "NOT_VALID" } | null; // status: is taken from UserDataStatus and is split to check for success

export type UserInstitutionLimited = { id: string, email: string };

export type UserDataProfile = {
    user: UserInstitutionLimited,
    lifetime: Date,
    institution?: Institution & {
        InstitutionLocation: {
            City: {
                State: {
                    Country: Country;
                };
            };
        }[];
    };
} | null;

export type PremiumAdDetailed = UserAd & {
    Subject: Subject | null;
};

// FORM

export type FormErrorRegister = {
    type: RegisterStatus,
    errorMessage: string,
};

export type FormErrorLogin = {
    type: LoginStatus,
    errorMessage: string,
};

// STATUS TYPES

export type RegisterStatus = "SUCCESS" | "INSTITUTION_TAKEN" | "INVALID_PASSWORD" | "INVALID_EMAIL" | "EMAIL_TAKEN" | "ERROR" | null;

export type LoginStatus = "SUCCESS" | "NO_AUTH" | "NO_USER" | "ERROR" | null;
