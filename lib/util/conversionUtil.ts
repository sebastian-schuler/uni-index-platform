import { DetailedCountry, DetailedInstitution, DetailedState, DetailedSubject, DetailedSubjectType, InstitutionCardData } from "../types/DetailedDatabaseTypes";
import { SmBestCardMinified, SmRankingEntry, SmRankingEntryMinified, SocialMediaDBEntry, SocialMediaPages, TotalScore, TwitterProfile, YoutubeProfile } from "../types/SocialMediaTypes";
import { CountryCardData, StateCardData, SubjectCardData, CategoryCardData } from "../types/UiHelperTypes";
import { PATH_COUNTRY_IMAGES, URL_INSTITUTION, URL_INSTITUTION_SOCIALMEDIA, URL_INSTITUTION_SUBJECTS, URL_LOCATION, URL_CATEGORY } from "../url-helper/urlConstants";
import { getBracketedName, getLocalizedName, getUniqueSubjectTypeCounts, toLink } from "./util";

/**
 * Minify a ranking entry to only contain the data needed for the ranking table
 * @param item 
 */
export const minifySmRankingItem = (item: SmRankingEntry): SmRankingEntryMinified => {
    const parsedScore = JSON.parse(item.total_score) as TotalScore;
    return {
        Institution: {
            name: item.Institution.name,
            url: item.Institution.url,
            countryId: item.Institution.City.State.Country.id,
        },
        combinedScore: parsedScore.percent.all.total,
        youtubeScore: parsedScore.percent.youtube.total,
        twitterScore: parsedScore.percent.twitter.total,
    }
}

/**
 * Minify a "Best (Youtube/Twitter) Card" to only contain the data needed
 * @param item 
 */
export const minifySmBestCard = (item: SocialMediaDBEntry, socialMediaSource: SocialMediaPages, locale: string): SmBestCardMinified | null => {
    const parsedScore = JSON.parse(item.total_score) as TotalScore;

    if (socialMediaSource === "youtube") {

        if (!item.youtube_profile) return null;
        const youtubeProfile = JSON.parse(item.youtube_profile) as YoutubeProfile;

        return {
            type: "youtube",
            Institution: {
                name: item.Institution.name,
                url: toLink(URL_INSTITUTION, item.Institution.City.State.Country.url, item.Institution.url, URL_INSTITUTION_SOCIALMEDIA),
                countryName: getLocalizedName({ lang: locale, dbTranslated: item.Institution.City.State.Country }),
            },
            youtubeScore: parsedScore.percent.youtube.total,
            totalSubscribers: youtubeProfile.subscribers,
            totalVideos: youtubeProfile.videos,
            avgViews: youtubeProfile.averageViews,
            avgComments: youtubeProfile.averageComments,
        }
    } else {
        if (!item.twitter_profile) return null;
        const parsedTwitter = JSON.parse(item.twitter_profile) as TwitterProfile;

        return {
            type: "twitter",
            Institution: {
                name: item.Institution.name,
                url: toLink(URL_INSTITUTION, item.Institution.City.State.Country.url, item.Institution.url, URL_INSTITUTION_SOCIALMEDIA),
                countryName: getLocalizedName({ lang: locale, dbTranslated: item.Institution.City.State.Country }),
            },
            twitterScore: parsedScore.percent.youtube.total,
            totalFollowers: parsedTwitter.followers,
            avgLikes: parsedTwitter.avgLikes,
            avgRetweets: parsedTwitter.avgRetweets,
            totalTweets: parsedTwitter.tweets,
        }
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
        mainStateId: inst.City.State.id,
        InstitutionSocialMedia: inst.InstitutionSocialMedia,
        subjectCount: inst._count.Subject,
        Institution: {
            url: inst.url,
            name: name,
            nameBrackets: nameBrackets,
            City: {
                name: inst.City.name,
                url: inst.City.url,
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
        popularity: country.popularity_score,
    }
}

export const convertCategoryToCardData = (category: DetailedSubjectType, lang: string): CategoryCardData => {

    return {
        id: category.id,
        name: getLocalizedName({ lang: lang, any: category }),
        url: toLink(URL_CATEGORY, category.url),
        subjectCount: category.subjectCount,
        popularity: category.popularity_score,
    }
}

export const convertStateToCardData = (state: DetailedState, lang: string): StateCardData => {

    const subjects = state.City.reduce((acc, city) => acc + city._count.Subject, 0);

    return {
        id: state.id,
        name: getLocalizedName({ lang: lang, state: state }),
        url: toLink(URL_LOCATION, state.Country.url, state.url),
        cityCount: state._count.City,
        subjectCount: subjects,
        popularity: state.popularity_score,
    }
}