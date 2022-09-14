import { ParsedUrlQuery } from "querystring";
import { getInstitutionPaths } from "../prisma/prismaQueries";

interface StaticPathsResult {
    params: ParsedUrlQuery;
    locale?: string | undefined;
}

/**
 * Get static paths of all /institution/[country]/[institution] pages
 * @param locales 
 */
export const getStaticPathsInstitution = async (locales: string[]): Promise<StaticPathsResult[]> => {

    const institutions = await getInstitutionPaths();

    let paths: {
        params: ParsedUrlQuery;
        locale?: string | undefined;
    }[] = [];

    // Add locale to every possible path
    locales.forEach((locale) => {
        institutions.forEach((institution) => {

            const mainLocationCountry = institution.City.State.Country.url;

            // Iterate every Institution but also every InstitutionLocation (unis can have multiple locations, even in different countries)
            institution.Subject.forEach((subject) => {
                paths.push({
                    params: {
                        Country: subject.City?.State.Country.url,
                        Institution: institution.url
                    },
                    locale,
                });
            })

            // Check if the main location was already added, add if not
            if (paths.findIndex(path => path.params.Country === mainLocationCountry && path.params.Institution === institution.url
                && path.locale === locale) === -1) {
                paths.push({
                    params: {
                        Country: mainLocationCountry,
                        Institution: institution.url
                    },
                    locale,
                });
            }

        })
    });

    return paths;
}