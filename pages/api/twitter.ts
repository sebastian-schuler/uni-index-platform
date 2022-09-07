import { NextApiRequest, NextApiResponse } from "next";


export default async (req: NextApiRequest, res: NextApiResponse) => {

    console.log(process.env.TWITTER_KEY)

}