import { getAds } from "../prisma/prismaAds";
import { DetailedUserAd } from "../types/DetailedDatabaseTypes";
import { AdCardData } from "../types/UiHelperTypes";
import { URL_INSTITUTION, URL_INSTITUTION_SUBJECTS } from "../url-helper/urlConstants";
import { toLink } from "../util/util";

export const getAdCardArray = async (source: string, lang: string): Promise<AdCardData[][]> => {

    // Get ads from database
    const ads: AdCardData[] = await getAds(source, lang);

    // sort by size
    ads.sort((a, b) => b.sizeCost - a.sizeCost);

    // Split into lists of sum of sizeCost <= 8
    const lists: AdCardData[][] = [[]];
    let x = 0;

    for (let i = 0; i < ads.length; i++) {

        const ad = ads[i];
        const currentTotal = lists[x].reduce((acc, curr) => { return acc + curr.sizeCost }, 0);

        // Create new list if current list would have sizeCost > 8
        if (currentTotal + ad.sizeCost > 8) {
            x += 1;
            lists[x] = [];
            lists[x].push(ad);
        } else {
            // Add to current list
            lists[x].push(ad);
        }

    };

    return lists;
}

/**
 * Define cost of ad based on size
 * @param ad 
 */
const getAdCost = (ad: DetailedUserAd) => {
    if (ad.size === 1) return 1;
    if (ad.size === 2) return 2;
    if (ad.size === 3) return 4;
    return 0;
}

/**
 * Simplify ad data to card data
 * @param ad 
 * @param lang 
 * @returns 
 */
export const convertAdToCardData = (ad: DetailedUserAd, lang: string): AdCardData | undefined => {

    let url = "";
    const titleObject = ad.title as { [key: string]: string };
    let title = titleObject?.en;
    let subtext = "";

    if (!title || !ad.subject) {
        return undefined;
    }

    if (ad.type === "subject") {
        url = toLink(URL_INSTITUTION, ad.user.institution.city.state.country.url, ad.user.institution.url, URL_INSTITUTION_SUBJECTS, ad.subject.url);
        subtext = ad.user.institution.name;
    } else if (ad.type === "institution") {
        url = toLink(URL_INSTITUTION, ad.user.institution.city.state.country.url, ad.user.institution.url);
        subtext = ad.user.institution.institution_city.length > 0 ? ad.user.institution.institution_city[0].city.name : "";
    }

    return {
        id: ad.id,
        title: title,
        subtext: subtext,
        fullUrl: url,
        type: ad.type,
        description: ad.description,
        imageId: ad.image_id,
        imageExtension: ad.user_image?.filetype || null,
        sizeCost: getAdCost(ad),
    }

}

