import { country, institution, user_ad, subject } from "@prisma/client";

// Type used in getStaticProps on the server
export type InstitutionRegistrationDBItem = {
    id: string;
    name: string;
    user: {
        _count: {
            user_session: number;
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
    subjects?: subject[]
    ads?: PremiumAdDetailed[]
} | { status: "NO_USER" | "NO_AUTH" | "NOT_VALID" } | null; // status: is taken from UserDataStatus and is split to check for success

export type UserInstitutionLimited = { id: string, email: string };

export type UserDataProfile = {
    user: UserInstitutionLimited,
    institution?: institution & {
        institution_city: {
            city: {
                state: {
                    country: country;
                };
            };
        }[];
    };
} | null;

export type PremiumAdDetailed = user_ad & {
    subject: subject | null;
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
