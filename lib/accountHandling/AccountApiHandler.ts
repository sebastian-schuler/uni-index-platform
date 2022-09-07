import { FormErrorLogin, FormErrorRegister, UserDataResponse } from "../types/AccountHandlingTypes";

// Get User Data from API
type GetUserDataProps = {
    profile?: boolean
    userSubjects?: boolean
    userAds?: boolean
}
export const getUserDataFromApi = async ({ profile, userSubjects, userAds }: GetUserDataProps) => {

    const params = new URLSearchParams({
        profile: String(profile || false),
        usersubjects: String(userSubjects || false),
        userads: String(userAds || false)
    });

    const res = await fetch('/api/account/user-data?' + params, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((t) => t.json());

    return res as UserDataResponse;
}

// UTIL
export const getErrorStringArr = (error: FormErrorRegister[] | FormErrorLogin[]) => {
    return error.map((t) => t.errorMessage);
}