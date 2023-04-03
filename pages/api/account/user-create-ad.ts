import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import * as fs from 'node:fs';
import path from 'node:path';
import { addNewAd, getSessionByToken, removeUserSession } from '../../../lib/prisma/prismaUserAccounts';
import { CreateAdLinkType } from '../../../lib/types/UiHelperTypes';
import { CreateAdLinkedItemType } from '../../../features/AccountCreateAd/CreateAdBuilder';
import { addNewArticle } from '../../../lib/prisma/prismaNews';
import { JSONContent } from '@tiptap/react';

export const config = {
    api: {
        bodyParser: false,
    },
};

// TODO error handling

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

    return new Promise(() => {

        form.parse(req, async (err, fields, files) => {

            if (err) {
                res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                res.end(String(err));
                return;
            }

            const bookingType = fields.bookingType ? fields.bookingType as CreateAdLinkType : null;

            if (bookingType) {

                const titleString = fields.title ? fields.title as string : null;
                const title = titleString ? { en: titleString } : undefined;

                if (bookingType === "link") {
                    // Create ad

                    const adType = fields.adType ? fields.adType as CreateAdLinkedItemType : null;
                    const size = fields.size ? Number(fields.size) : null;
                    const description = fields.description ? fields.description as string : null;
                    const dateFrom = fields.dateFrom ? Number(fields.dateFrom) : null;
                    const dateTo = fields.dateTo ? Number(fields.dateTo) : null;
                    let image: formidable.File | null = null;
                    let subject: string | null = null;

                    if (adType === "subject") {
                        subject = fields.subject ? fields.subject as string : null;
                    }

                    if (size && (size === 2 || size === 3)) {
                        image = files.image ? files.image as formidable.File : null;
                    }

                    // Check if all data is present
                    if (!dateFrom || !dateTo || !adType || !size) {
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end("Missing data");
                        return;
                    }

                    // addNewAd({
                    //     title: title, booked_from: dateFrom, booked_until: dateTo, date_booked: Date.now(), description: description, image_id: null, placement: [], size: size,
                    //     subject_id: subject, type: adType, user_id: session.user_id
                    // });

                } else if (bookingType === "article") {
                    // Create article

                    const excerpt = fields.excerpt ? fields.excerpt as string : null;
                    const contentStringified = fields.content ? fields.content as string : null;
                    const content = contentStringified ? JSON.parse(contentStringified) as JSONContent : null;
                    let image = files.image ? files.image as formidable.File : null;

                    // Check if all data is present
                    if (!title || !content || !excerpt) {
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end("Missing data");
                        return;
                    }

                    // Check if image is present
                    if (image) {

                        // Check if file is an image
                        if (!image.mimetype?.startsWith("image/")) { // 
                            res.writeHead(400, { 'Content-Type': 'text/plain' });
                            res.end("File is not an image");
                            return;
                        }

                        // Check if image is too big (1MB)
                        if (image.size > 1000000) {
                            res.writeHead(400, { 'Content-Type': 'text/plain' });
                            res.end("Image too big");
                            return;
                        }

                        // Get file extension
                        const fileExtension = image.originalFilename?.split('.').pop();

                        // Check if file is an image
                        if (!fileExtension) { // 
                            res.writeHead(400, { 'Content-Type': 'text/plain' });
                            res.end("Invalid file type");
                            return;
                        }

                        // Get title of the main locale for url
                        const mainLocaleTitle = title.en;
                        const newUrl = encodeURIComponent(mainLocaleTitle).normalize("NFC");

                        // Add article to database
                        const dbResult = await addNewArticle({
                            title, excerpt, content,
                            url: newUrl,
                            user_id: session.user_id,
                            filetype: fileExtension
                        }).catch((err) => {
                            console.log(err);
                        });

                        // If article was added to database
                        if (dbResult) {
                            // Copy image to uploads folder
                            const isImageCopied = await new Promise(resolve => {
                                if (image) {
                                    fs.copyFile(image.filepath, path.join('uploads', `${dbResult.user_image.id}.${fileExtension}`), () => {
                                        resolve(true);
                                    });
                                } else {
                                    resolve(false);
                                }
                            });

                            // If image was copied
                            if (isImageCopied) {
                                res.writeHead(200, { 'Content-Type': 'text/plain' });
                                res.end("Article created");
                                return;
                            } else {
                                // If image was not copied

                                // Remove article from database
                                // await removeArticle(dbResult.user_image.id);

                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                res.end("Image copy error");
                                return;
                            }
                        } else {
                            // Error on article creation
                            res.writeHead(400, { 'Content-Type': 'text/plain' });
                            res.end("Article DB creation error");
                            return;
                        }
                    } else {
                        // If image is missing
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end("Missing image");
                        return;
                    }
                }

            } else {
                // No booking type error
                res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                res.end("No booking type");
                return;
            }

        });

    });
}


        // console.log(type,size,until,description,subject);

        // const keys = Object.keys(files);

        // console.log("keys: ", keys);

        // if (keys.length > 0) {
        // const file = files[keys[0]] as formidable.File;

        // console.log(file.size);

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

        // fs.promises.copyFile(file.filepath, path.join('uploads', 'bild.jpg')).then(() => {
        //     console.log("ok");
        // }).catch((err) => {
        //     console.log(err)
        // });

        // }