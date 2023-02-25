import { NextApiRequest, NextApiResponse } from "next";
import { getJobParameters } from "../../lib/apis/jobsHandler";

let tokenExpiration: Date;
let token: string;

const jobsHandler = async (req: NextApiRequest, res: NextApiResponse) => {

  // Get token, it lasts for 60 min
  if (tokenExpiration === undefined || new Date() >= tokenExpiration || token === undefined) {

    const endpointToken = `https://rest.arbeitsagentur.de/oauth/gettoken_cc`;
    const configToken = {
      body: "client_id=c003a37f-024f-462a-b36d-b001be4cd24a&client_secret=32a39620-32b3-4307-9aa1-511e3d7f48a8&grant_type=client_credentials",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
      },
      method: "POST"
    };
    const responseToken = await fetch(endpointToken, configToken);
    const jsonToken = await responseToken.json() as any;
    token = jsonToken.access_token;
    const lifetime: number = jsonToken.expires_in;
    tokenExpiration = new Date(Date.now() + (lifetime * 1000));

  }

  // Build Parameter string
  let parameters = getJobParameters(req.query);

  // https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobs?angebotsart=1&wo=Berlin&umkreis=200&arbeitszeit=ho;mj&page=1&size=25&pav=false
  // Get data
  const endpointData = `https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobs?${parameters}`;
  const configData = {
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Cache-Control": "no-cache",
      Dnt: "1",
      OAuthAccessToken: token,
      Pragma: "no-cache"
    }
  };

  const responseData = await fetch(endpointData, configData);
  const jsonData = await responseData.text();

  res.status(200).json(jsonData)
}

export default jobsHandler;
