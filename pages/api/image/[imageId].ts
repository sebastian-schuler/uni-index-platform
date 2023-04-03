import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises'
import { existsSync } from 'fs';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const { imageId } = req.query;

    const path = `uploads/${imageId}.png`;

    if (existsSync(path)) {

        const image = await fs.readFile(path).catch((err) => {
            console.log(err);
        });

        res.setHeader('Content-Type', 'image/png');
        // res.setHeader('Content-Size', image.length)
        res.setHeader('Content-Disposition', 'inline; filename="test.png"')
        res.status(200);
        res.send(image);
        return;

    } else {
        res.status(404);
        res.send("Image not found");
        return;
    }

}
