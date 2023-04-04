import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises'
import { existsSync } from 'fs';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const { imageId, ext } = req.query;
    const fileExtension = typeof ext === 'string' ? ext : "jpg";
    const path = `uploads/${imageId}.${fileExtension}`;

    if (existsSync(path)) {

        const image = await fs.readFile(path).catch((err) => {
            console.log(err);
        });

        res.setHeader('Content-Type', 'image/png');
        // res.setHeader('Content-Size', image.length)
        res.setHeader('Content-Disposition', `inline; filename="${imageId}.${fileExtension}"`)
        res.status(200);
        res.send(image);
        return;

    } else {
        res.status(404);
        res.send("Image not found");
        return;
    }

}
