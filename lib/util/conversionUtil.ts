import { DetailedCity, DetailedCountry, DetailedInstitution, DetailedState, DetailedSubject, DetailedSubjectType } from "../types/DetailedDatabaseTypes";
import { SmBestCardMinified, SmRankingEntry, SmRankingEntryMinified, SocialMediaDBEntry, SocialMediaPages, TotalScore, TwitterProfile, YoutubeProfile } from "../types/SocialMediaTypes";
import { CategoryCardData, CityCardData, CountryCardData, InstitutionCardData, StateCardData, SubjectCardData } from "../types/UiHelperTypes";
import { PATH_COUNTRY_IMAGES, URL_CATEGORY, URL_INSTITUTION, URL_LOCATION } from "../url-helper/urlConstants";
import { getLocalizedName, getUniqueCategoryCounts, toLink } from "./util";

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
        institution: {
            name: item.institution.name,
            url: item.institution.url,
            countryId: item.institution.city.state.country.id,
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
            institution: {
                name: item.institution.name,
                url: item.institution.url,
            },
            country: {
                name: getLocalizedName({ lang: locale, dbTranslated: item.institution.city.state.country }),
                url: item.institution.city.state.country.url,
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
            institution: {
                name: item.institution.name,
                url: item.institution.url,
            },
            country: {
                name: getLocalizedName({ lang: locale, dbTranslated: item.institution.city.state.country }),
                url: item.institution.city.state.country.url,
            },
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
    const categories = getUniqueCategoryCounts({ list: inst.subject || [], lang: lang, itemCount: 3 })

    return {
        mainCountryId: inst.city.state.country.id,
        mainStateId: inst.city.state.id,
        socialMedia: inst.institution_socials,
        subjectCount: inst._count.subject,
        institution: {
            url: inst.url,
            name: name,
            nameBrackets: nameBrackets,
            city: {
                name: inst.city.name,
                url: inst.city.url,
            }
        },
        campusCount: inst.institution_city.length,
        biggestCategories: categories
    }
}

/**
 * Minifies the DetailedSubject object to only contain the data needed for the subject card
 * @param sub 
 * @param lang 
 */
export const convertSubjectToCardData = (subj: DetailedSubject, lang: string): SubjectCardData => {

    let categories = subj.subject_category.map((type) => {
        return ({
            name: getLocalizedName({ lang: lang, any: type.category }),
            url: type.category.url
        })
    });

    // Only show the first three categories
    categories = categories.slice(0, 3);

    return {
        id: subj.id,
        name: subj.name,
        url: subj.url,
        countryId: subj.city.state.country.id,
        degree: subj.degree,
        duration: subj.duration,
        durationType: subj.duration_type,
        categories: categories,
        institution: {
            name: subj.institution.name,
            url: subj.institution.url,
        },
        city: {
            name: subj.city.name,
            fullUrl: toLink(URL_LOCATION, subj.city.state.country.url, subj.city.state.url, subj.city.url),
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
        subject_count: category.subject_count,
        popularity: category.popularity_score,
    }
}

export const convertStateToCardData = (state: DetailedState, lang: string): StateCardData => {

    const subjects = state.city.reduce((acc, city) => acc + city._count.subject, 0);

    return {
        id: state.id,
        name: getLocalizedName({ lang: lang, state: state }),
        url: toLink(URL_LOCATION, state.country.url, state.url),
        cityCount: state._count.city,
        subjectCount: subjects,
        popularity: state.popularity_score,
    }
}

export const convertCityToCardData = (city: DetailedCity, lang: string): CityCardData => {

    const institutionCount = city._count.institution_city;

    return {
        id: city.id,
        name: city.name,
        fullUrl: toLink(URL_LOCATION, city.state.country.url, city.state.url, city.url),
        institutionCount: institutionCount,
        areaCodes: city.postcodes,
        popularity: city.popularity_score,
    }
}

