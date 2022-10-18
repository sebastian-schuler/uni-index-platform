import { CountryCardData, DetailedCountry, DetailedInstitution, DetailedSubject, InstitutionCardData, SubjectCardData } from "../types/DetailedDatabaseTypes";
import { SmRankingEntry, SmRankingEntryMinified, TotalScore } from "../types/SocialMediaTypes";
import { PATH_COUNTRY_IMAGES, URL_INSTITUTION, URL_INSTITUTION_SUBJECTS, URL_LOCATION } from "../url-helper/urlConstants";
import { getBracketedName, getLocalizedName, getUniqueSubjectTypeCounts, toLink } from "./util";

/**
 * Minify a ranking entry to only contain the data needed for the ranking table
 * @param item 
 */
export const minifySmRankingItem = (item: SmRankingEntry): SmRankingEntryMinified => {
    const parsedScore = JSON.parse(item.total_score) as TotalScore;
    const total = parsedScore.all.total;
    return {
        Institution: {
            name: item.Institution.name,
            url: item.Institution.url,
            countryId: item.Institution.City.State.Country.id,
        },
        total_score: total,
        yt_total_score: parsedScore.youtubeOnly.total,
        tw_total_score: parsedScore.twitterOnly.total,
    }
}

/**
 * Minifies the DetailedInstitution object to only contain the data needed for the institution card
 * @param inst 
 * @param lang 
 */
export const convertInstitutionToCardData = (inst: DetailedInstitution, lang: string): InstitutionCardData => {

    const { name, nameBrackets } = getBracketedName(getLocalizedName({ lang: lang, institution: inst }));
    const subjectTypes = getUniqueSubjectTypeCounts({ list: inst.Subject || [], lang: lang, itemCount: 3 })

    return {
        mainCountryId: inst.City.State.Country.id,
        InstitutionSocialMedia: inst.InstitutionSocialMedia,
        subjectCount: inst._count.Subject,
        Institution: {
            url: inst.url,
            name: name,
            nameBrackets: nameBrackets,
            City: {
                name: inst.City.name,
            }
        },
        campusCount: inst.InstitutionLocation.length,
        biggestSubjectTypes: subjectTypes
    }
}

/**
 * Minifies the DetailedSubject object to only contain the data needed for the subject card
 * @param sub 
 * @param lang 
 */
export const convertSubjectToCardData = (subj: DetailedSubject, lang: string): SubjectCardData => {

    const subjectTypeNames = subj.SubjectHasSubjectTypes.map((type) => getLocalizedName({ lang: lang, any: type.SubjectType }));
    let subjectType = "";
    for (let i = 0; i < 2 && i < subjectTypeNames.length; i++) {
        subjectType += subjectTypeNames[i] + " / ";
    }
    subjectType = subjectType.slice(0, -3);

    return {
        name: subj.name,
        fullUrl: toLink(URL_INSTITUTION, subj.City.State.Country.url, subj.Institution.url, URL_INSTITUTION_SUBJECTS, subj.url),
        countryId: subj.City.State.Country.id,
        degree: subj.degree,
        duration: subj.duration,
        durationType: subj.duration_type,
        subjectTypes: subjectType,
        Institution: {
            name: subj.Institution.name,
        },
        City: {
            name: subj.City.name,
        }
    }
}

export const convertCountryToCardData = (country: DetailedCountry, lang: string, linkType: "location" | "institution"): CountryCardData => {

    const url = linkType === 'location' ? toLink(URL_LOCATION, country.url) : toLink(URL_INSTITUTION, country.url);

    return {
        name: getLocalizedName({ lang: lang, dbTranslated: country }),
        url: url,
        imgSrc: toLink(PATH_COUNTRY_IMAGES, country.url + ".jpg"),
        countryCode: country.country_code,
        subjectCount: country.subjectCount,
        institutionCount: country.institutionCount,
    }
}