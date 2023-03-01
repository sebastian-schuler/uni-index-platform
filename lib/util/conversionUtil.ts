import { DetailedCountry, DetailedInstitution, DetailedState, DetailedSubject, DetailedSubjectType } from "../types/DetailedDatabaseTypes";
import { SmBestCardMinified, SmRankingEntry, SmRankingEntryMinified, SocialMediaDBEntry, SocialMediaPages, TotalScore, TwitterProfile, YoutubeProfile } from "../types/SocialMediaTypes";
import { CategoryCardData, CountryCardData, InstitutionCardData, StateCardData, SubjectCardData } from "../types/UiHelperTypes";
import { PATH_COUNTRY_IMAGES, URL_CATEGORY, URL_INSTITUTION, URL_INSTITUTION_SOCIALMEDIA, URL_LOCATION } from "../url-helper/urlConstants";
import { getLocalizedName, getUniqueSubjectTypeCounts, toLink } from "./util";

// ========================== Helper Functions ==========================

// Split a name into the actual name, and whatever is in brackets
const getBracketedName = (name: string) => {
    let newName = name;
    const nameBrackets = name.match(/\(.*\)/gi)?.[0] || "";
    if (nameBrackets !== "") newName = name.replace(nameBrackets, "").trim();
    return { name: newName, nameBrackets: nameBrackets };
}

// ========================== Minify Functions ==========================

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
            href: item.youtube_url,
            Institution: {
                name: item.Institution.name,
                url: item.Institution.url, // toLink(URL_INSTITUTION,, , URL_INSTITUTION_SOCIALMEDIA),
            },
            Country: {
                name: getLocalizedName({ lang: locale, dbTranslated: item.Institution.City.State.Country }),
                url: item.Institution.City.State.Country.url,
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
            href: item.youtube_url,
            Institution: {
                name: item.Institution.name,
                url: item.Institution.url, // toLink(URL_INSTITUTION,, , URL_INSTITUTION_SOCIALMEDIA),
            },
            Country: {
                name: getLocalizedName({ lang: locale, dbTranslated: item.Institution.City.State.Country }),
                url: item.Institution.City.State.Country.url,
            },
            // Institution: {
            //     name: item.Institution.name,
            //     url: toLink(URL_INSTITUTION, item.Institution.City.State.Country.url, item.Institution.url, URL_INSTITUTION_SOCIALMEDIA),
            //     countryName: getLocalizedName({ lang: locale, dbTranslated: item.Institution.City.State.Country }),
            // },
            twitterScore: parsedScore.percent.youtube.total,
            totalFollowers: parsedTwitter.followers,
            avgLikes: parsedTwitter.avgLikes,
            avgRetweets: parsedTwitter.avgRetweets,
            totalTweets: parsedTwitter.tweets,
        }
    }

}

// ========================== Conversion Functions ==========================

/**
 * Minifies the DetailedInstitution object to only contain the data needed for the institution card
 * @param inst 
 * @param lang 
 */
export const convertInstitutionToCardData = (inst: DetailedInstitution, lang: string): InstitutionCardData => {

    const { name, nameBrackets } = getBracketedName(getLocalizedName({ lang: lang, institution: inst }));
    const categories = getUniqueSubjectTypeCounts({ list: inst.Subject || [], lang: lang, itemCount: 3 })

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
        biggestCategories: categories
    }
}

/**
 * Minifies the DetailedSubject object to only contain the data needed for the subject card
 * @param sub 
 * @param lang 
 */
export const convertSubjectToCardData = (subj: DetailedSubject, lang: string): SubjectCardData => {

    let categories = subj.SubjectHasSubjectTypes.map((type) => {
        return ({
            name: getLocalizedName({ lang: lang, any: type.SubjectType }),
            url: type.SubjectType.url
        })
    });

    // Only show the first three categories
    categories = categories.slice(0, 3);

    return {
        id: subj.id,
        name: subj.name,
        url: subj.url,
        countryId: subj.City.State.Country.id,
        degree: subj.degree,
        duration: subj.duration,
        durationType: subj.duration_type,
        categories: categories,
        Institution: {
            name: subj.Institution.name,
            url: subj.Institution.url,
        },
        City: {
            name: subj.City.name,
            fullUrl: toLink(URL_LOCATION, subj.City.State.Country.url, subj.City.State.url, subj.City.url),
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