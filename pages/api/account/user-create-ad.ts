import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import * as fs from 'node:fs';
import path from 'node:path';
import { addNewAd, getSessionByToken, removeUserSession } from '../../../lib/prismaQueries';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    // ============= CHECK IF LOGGED IN =====================

    const authToken = req.cookies['institution-session'];

    // If token doesn't exist
    if (authToken === undefined || authToken === "") {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Request denied');
        return;
    }

    const session = await getSessionByToken(authToken);

    // If session invalid
    if (session === null || Number(session.lifetime) < Date.now()) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Request denied');
        return;

        // If session lifetime is up
    } else if (Number(session.lifetime) < Date.now()) {
        removeUserSession(session.token);
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Token expired');
        return;

    }

    // ============= IF LOGGED IN, GET FORM DATA =====================

    const form = new formidable.IncomingForm({ keepExtensions: true });

    form.parse(req, (err, fields, files) => {

        if (err) {
            res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
            res.end(String(err));
            return;
        }

        const { type, size, until, description, subject } = fields;

        console.log(type,size,until,description,subject);

        const keys = Object.keys(files);

        console.log("keys: ", keys);

        if (keys.length > 0) {
            const file = files[keys[0]] as formidable.File;

            console.log(file.size);

            // addNewAd(
            //     0,
            //     Number(fields.until),
            //     fields.adtype as string,
            //     Number(fields.adsize),
            //     [],
            //     Number(fields.user_id),
            //     Number(fields.subject_id),
            //     fields.description as string,
            //     "",
            // );

            fs.promises.copyFile(file.filepath, path.join('uploads', 'bild.jpg')).then(() => {
                console.log("ok");
            }).catch((err) => {
                console.log(err)
            });

        }

    });

}
