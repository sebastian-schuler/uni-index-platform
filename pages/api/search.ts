import { NextApiRequest, NextApiResponse } from "next";
import { prismaGlobalSearch } from "../../lib/prisma/prismaGlobalSearch";

const jobsHandler = async (req: NextApiRequest, res: NextApiResponse) => {

    let searchTerm = req.query.q;
    let lang = typeof req.query.lang === 'string' ? req.query.lang : 'en';

    if (typeof searchTerm !== 'string') {
        res.status(400).json({ error: 'Invalid search term' });
        return;
    }

    const searchResult = await prismaGlobalSearch(searchTerm, lang);

    res.status(200).json({ searchResult });
}

export default jobsHandler;
