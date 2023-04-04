import { JSONContent } from '@tiptap/react';
import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'node:fs';
import path from 'node:path';
import { CreateAdLinkedItemType } from '../../../features/AccountCreateAd/CreateAdBuilder';
import { addNewArticle } from '../../../lib/prisma/prismaArticles';
import { getSessionByToken, removeUserSession } from '../../../lib/prisma/prismaUserAccounts';
import { CreateAdLinkType } from '../../../lib/types/UiHelperTypes';
import { addNewAd } from '../../../lib/prisma/prismaAds';

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

                console.log(fields.title);
                const titleString = fields.title ? fields.title as string : null;
                const title = titleString ? { en: titleString } : undefined;

                // Check if title is missing
                if (!titleString || !title) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end("Missing title data");
                    return;
                }

                let isCreated = false;
                let imageDbId: string | null = null;
                let image: formidable.File | null = null;
                let fileExtension: string | null = null;

                if (bookingType === "link") {
                    // ========================================================
                    // ==================== CREATE AD =========================
                    // ========================================================

                    const adType = fields.adType ? fields.adType as CreateAdLinkedItemType : null;
                    const size = fields.size ? Number(fields.size) : null;
                    const description = fields.description ? fields.description as string : null;
                    const dateFrom = fields.dateFrom ? Number(fields.dateFrom) : null;
                    const dateTo = fields.dateTo ? Number(fields.dateTo) : null;
                    let subjectId: string | null = null;

                    if (adType === "subject") {
                        subjectId = fields.subject ? fields.subject as string : null;
                    }

                    if (size && (size === 2 || size === 3)) {
                        image = files.image ? files.image as formidable.File : null;

                        // Check if image is missing
                        if (!image) {
                            res.writeHead(400, { 'Content-Type': 'text/plain' });
                            res.end("Missing image");
                            return;
                        }

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
                        fileExtension = image.originalFilename?.split('.').pop() || null;

                        // Check if file is an image
                        if (!fileExtension) { // 
                            res.writeHead(400, { 'Content-Type': 'text/plain' });
                            res.end("Invalid file type");
                            return;
                        }
                    }

                    // Check if all data is present
                    if (!dateFrom || !dateTo || !adType || !size) {
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end("Missing data");
                        return;
                    }

                    const dbResult = await addNewAd({
                        title, description, size,
                        booked_from: dateFrom, booked_until: dateTo,
                        filetype: fileExtension,
                        placement: { generic: ['all'] },
                        type: adType,
                        subject_id: subjectId,
                        user_id: session.user_id,
                        withImage: image && fileExtension ? true : false
                    });

                    if (dbResult) {
                        isCreated = true;
                        imageDbId = dbResult.user_image?.id || null;
                    }

                } else if (bookingType === "article") {

                    // ========================================================
                    // ==================== CREATE ARTICLE ====================
                    // ========================================================

                    const excerpt = fields.excerpt ? fields.excerpt as string : null;
                    const contentStringified = fields.content ? fields.content as string : null;
                    const content = contentStringified ? JSON.parse(contentStringified) as JSONContent : null;
                    image = files.image ? files.image as formidable.File : null;

                    // Check if all data is present
                    if (!content || !excerpt) {
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
                        fileExtension = image.originalFilename?.split('.').pop() || null;

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

                        if (dbResult) {
                            isCreated = true;
                            imageDbId = dbResult.user_image?.id || null;
                        }

                    } else {
                        // If image is missing
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end("Missing image");
                        return;
                    }
                }

                // If article/ad was added to database
                if (isCreated) {

                    if (image) {
                        // Copy image to uploads folder
                        const isImageCopied = await new Promise(resolve => {
                            if (image) {
                                fs.copyFile(image.filepath, path.join('uploads', `${imageDbId}.${fileExtension}`), () => {
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

                            // Remove article or ad from database
                            // await removeArticle(dbResult.user_image.id);

                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end("Image copy error");
                            return;
                        }
                    }else{
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end("Ad created");
                        return;
                    }

                } else {
                    // Error on article creation
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end("Article DB creation error");
                    return;
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