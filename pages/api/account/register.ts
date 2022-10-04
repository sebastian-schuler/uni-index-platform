import bcrypt from 'bcrypt';
import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isDisplayNameValid, isEmailValid, isPasswordValid } from '../../../lib/accountHandling/regex';
import { addNewUser, addUserSession, getUserCountByEmail, getUserCountByInstitution } from '../../../lib/prisma/prismaUserAccounts';
import { RegisterStatus } from '../../../lib/types/AccountHandlingTypes';
import { addDays } from '../../../lib/util';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (!req.body) {
        res.statusCode = 404;
        res.end('Error');
        return;
    }

    const { email, password, institutionID, displayName } = req.body;
    let status: RegisterStatus = null;

    // Check if institutionID is taken
    const typedInstitutionId: string = institutionID;
    const institutionCount = await getUserCountByInstitution(typedInstitutionId);
    if (institutionCount > 0) {
        status = 'INSTITUTION_TAKEN';
        res.json({ status: status });
        return;
    }

    // Check Email structure
    const typedEmail: string = email;
    if (!isEmailValid(typedEmail)) {
        status = 'INVALID_EMAIL';
        res.json({ status: status });
        return;
    } else {

        // Check if it already exists
        const count = await getUserCountByEmail(typedEmail);
        if (count > 0) {
            status = 'EMAIL_TAKEN';
            res.json({ status: status });
            return;
        }

        // TODO Check Email URL, compare to institute Email URL
    }

    // Password security check
    const typedPassword: string = password;
    if (!isPasswordValid(typedPassword)) {
        status = 'INVALID_PASSWORD';
        res.json({ status: status });
        return;
    }

    // Hash password
    const hash = bcrypt.hashSync(typedPassword, 10);

    // LOGIN NEW USER
    status = 'SUCCESS';
    const createdUser = await addNewUser(typedEmail, hash, typedInstitutionId, Date.now());
    // Create new random string as token
    let token = crypto.randomBytes(40).toString('hex');
    // Set lifetime of token
    const lifetime = addDays(new Date(), 3);
    // Save in DB
    addUserSession(token, createdUser.id, lifetime.getTime());
    // Send response
    res.json({
        token: token,
        lifetime: lifetime,
        status: status,
    });
}
