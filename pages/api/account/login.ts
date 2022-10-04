import bcrypt from 'bcrypt';
import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { addUserSession, getUserLogin } from '../../../lib/prisma/prismaUserAccounts';
import { LoginStatus } from '../../../lib/types/AccountHandlingTypes';
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

    const { username, password } = req.body;
    const user = await getUserLogin(username);
    let status: LoginStatus = null;

    const passwordMatches = user !== null && await bcrypt.compare(password, user.password);

    if (user === null) {

        status = "NO_USER";
        res.json({ status: status });
        return;

    } else if (username === user.email && passwordMatches) {

        status = "SUCCESS";
        // Create new random string as token
        let token = crypto.randomBytes(40).toString('hex');
        // Set lifetime of token
        const lifetime = addDays(new Date(), 3);
        // Save in DB
        addUserSession(token, user.id, lifetime.getTime());
        // Send response
        res.json({
            token: token,
            lifetime: lifetime,
            status: status,
        });
        return;

    } else {

        status = "NO_AUTH";
        res.json({ status: status });
        return;

    }

}
