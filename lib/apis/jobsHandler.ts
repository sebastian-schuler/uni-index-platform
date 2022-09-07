import { SERVER_URL } from "../config";
import { addParameter } from "../util";

type JobAPIParameters = {
    was?: string,
    wo?: string,
    berufsfeld?: string,
    arbeitgeber?: string,
    zeitarbeit?: string,
    size?: string,
    veroeffentlichtseit?: string,
    angebotsart?: string,
    umkreis?: string,
    arbeitszeit?: string,
    page?: string,
    pav?: string,
}

export async function getJobsFromApi(parameters: JobAPIParameters) {
    const endpoint = `${SERVER_URL}/api/jobs?${getJobParameters({ apiParameters: parameters })}`;
    console.log(endpoint)
    // const response = await fetch(endpoint);
    // if (!response.ok) {
    //     throw Error(response.statusText);
    // }
    // const json = await response.json();
    // return json;
}

type JobParameterQuery = {
    query?: { [key: string]: string | string[] },
    apiParameters?: JobAPIParameters,
};

export const getJobParameters = ({ query, apiParameters }: JobParameterQuery) => {

    let parameters = "";
    parameters = addParameter("was", query?.was ?? apiParameters?.was, parameters);
    parameters = addParameter("wo", query?.wo ?? apiParameters?.wo, parameters);
    parameters = addParameter("berufsfeld", query?.berufsfeld ?? apiParameters?.berufsfeld, parameters);
    parameters = addParameter("arbeitgeber", query?.arbeitgeber ?? apiParameters?.arbeitgeber, parameters);
    parameters = addParameter("zeitarbeit", query?.zeitarbeit ?? apiParameters?.zeitarbeit, parameters);
    parameters = addParameter("size", query?.size ?? apiParameters?.size, parameters, 20);
    parameters = addParameter("veroeffentlichtseit", query?.veroeffentlichtseit ?? apiParameters?.veroeffentlichtseit, parameters);
    parameters = addParameter("angebotsart", query?.angebotsart ?? apiParameters?.angebotsart, parameters, 1);
    parameters = addParameter("umkreis", query?.umkreis ?? apiParameters?.umkreis, parameters);
    parameters = addParameter("arbeitszeit", query?.arbeitszeit ?? apiParameters?.arbeitszeit, parameters);
    parameters = addParameter("page", query?.page ?? apiParameters?.page, parameters);
    parameters = addParameter("pav", query?.pav ?? apiParameters?.pav, parameters, false);
    return parameters;
}