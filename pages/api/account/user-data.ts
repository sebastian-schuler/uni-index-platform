import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdsByUser, getInstitutionByUser, getSubjectsByInstitute, getUserFromToken } from '../../../lib/prisma/prismaQueries';
import { UserDataProfile } from '../../../lib/types/AccountHandlingTypes';

export type UserDataStatus = "SUCCESS" | "NO_USER" | "NO_AUTH" | "NOT_VALID" | null;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const authToken = req.cookies['institution-session'];
    let status: UserDataStatus = null;

    if (authToken === undefined || authToken === "") {
        status = "NO_AUTH";
        res.json({ status: status });
        return;
    }

    const userData = await getUserFromToken(authToken);

    if (userData === null) {
        status = "NO_USER";
        res.json({ status: status });
        return;

    } else {

        const now = new Date();
        const validUntil = new Date(Number(userData.lifetime));

        if (validUntil > now) {

            status = "SUCCESS";

            let result = { status: status };

            // Possible query parameters
            if (req.query.profile === "true") {
                const institutionResult = await getInstitutionByUser(Number(userData.User.id));
                const profile: UserDataProfile = { user: userData.User, lifetime: validUntil, institution: institutionResult?.Institution || undefined };
                result["profile"] = profile;
            }

            if (req.query.usersubjects === "true") {
                const instituteSubjects = await getSubjectsByInstitute(userData.User.id);
                result["subjects"] = instituteSubjects === null ? [] : instituteSubjects.Institution.Subject;
            }

            if (req.query.userads === "true") {
                const ads = await getAdsByUser(userData.User.id);
                result["ads"] = ads === null ? [] : ads;
            }

            res.json(result);
            return;

        } else {

            status = "NOT_VALID";
            res.json({ status: status });
            return;

        }

    }

}
