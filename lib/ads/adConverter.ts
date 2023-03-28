import { getAds } from "../prisma/prismaQueries";
import { DetailedUserAd } from "../types/DetailedDatabaseTypes";
import { AdCardData } from "../types/UiHelperTypes";
import { URL_INSTITUTION } from "../url-helper/urlConstants";
import { toLink } from "../util/util";

export const getAdCardArray = async (source: string, lang: string): Promise<AdCardData[][]> => {

    // Get ads from database
    const ads: DetailedUserAd[] = await getAds(source);

    // Convert ads to card data
    const adCards = ads.map(ad => convertAdToCardData(ad, lang));
    // sort by size
    adCards.sort((a, b) => b.sizeCost - a.sizeCost);

    // Split into lists of sum of sizeCost <= 8
    const lists: AdCardData[][] = [[]];
    let x = 0;

    for (let i = 0; i < adCards.length; i++) {

        const ad = adCards[i];
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
const convertAdToCardData = (ad: DetailedUserAd, lang: string): AdCardData => {

    let url = "";
    let title = "";
    let subtext = "";

    if (ad.type === "subject") {
        url = toLink(URL_INSTITUTION, ad.user.institution.city.state.country.url, ad.user.institution.url, ad.subject?.url || "");
        title = ad.subject?.name || "";
        subtext = ad.user.institution.name;
    } else if (ad.type === "institution") {
        url = toLink(URL_INSTITUTION, ad.user.institution.city.state.country.url, ad.user.institution.url || "");
        title = ad.user.institution.name;
        subtext = ad.user.institution.institution_city.length > 0 ? ad.user.institution.institution_city[0].city.name : "";
    }

    return {
        id: ad.id,
        title: title,
        subtext: subtext,
        fullUrl: url,
        type: ad.type,
        description: ad.description,
        imageUrl: ad.image_id,
        sizeCost: getAdCost(ad),
    }

}

