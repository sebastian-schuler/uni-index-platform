import { CountrySocialRating, CountryTwitterSummary, CountryYoutubeSummary } from '../types/social-media/CountrySocialRatingTypes';
import { BestSocialMediaItem, SocialMediaGenericRankingItem } from '../types/social-media/SocialMediaSimplifiedTypes';
import { TwitterProfile } from '../types/social-media/TwitterTypes';
import { YoutubeChannel } from '../types/social-media/YoutubeTypes';
import { URL_INSTITUTION, URL_INSTITUTION_SOCIALMEDIA, URL_LOCATION } from '../url-helper/urlConstants';
import { getLocalizedName, toLink } from '../util/util';
import prisma from './prisma';

// ===========================================================
// ================= SOCIAL MEDIA RANKING ====================
// ===========================================================

/**
 * Get a specific countries social media averages
 * @param countryId 
 * @returns 
 */
export const getCountrySocialmedia = async (countryId: string): Promise<CountrySocialRating | null> => {
    const res = await prisma.country_socials.findUnique({
        where: {
            country_id: countryId
        },
    })
    if (!res) return null;

    return {
        countryId: res.country_id,
        count: Number(res.rated_institution_count),
        profile: {
            youtube: res.avg_youtube_profile ? res.avg_youtube_profile as CountryYoutubeSummary : null,
            twitter: res.avg_twitter_profile ? res.avg_twitter_profile as CountryTwitterSummary : null,
        },
        score: {
            avgYoutube: Number(res.avg_youtube_score),
            avgTwitter: Number(res.avg_twitter_score),
            avgInstagram: Number(res.avg_instagram_score),
            avgFacebook: Number(res.avg_facebook_score),
            avgTotal: Number(res.avg_total_score),
        }
    };
}

type GetSocialMediaRankingProps = {
    take?: number
} | undefined;
/**
 * Return generic ranking of all institutions, with their total score and their country
 * @returns 
 */
export const getSocialMediaRanking = async (props: GetSocialMediaRankingProps): Promise<SocialMediaGenericRankingItem[]> => { //
    const res = await prisma.institution_socials.findMany({
        select: {
            institution_id: true,
            total_score: true,
            youtube_score: true,
            twitter_score: true,
            instagram_score: true,
            facebook_score: true,
            last_update: true,
            institution: {
                select: {
                    name: true,
                    url: true,
                    city: {
                        select: {
                            url: true,
                            state: {
                                select: {
                                    url: true,
                                    country: {
                                        select: {
                                            id: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        },
        take: props?.take,
        orderBy: {
            total_score: 'desc'
        }
    })

    return res.map((item) => {
        return {
            institution_id: item.institution_id,
            institution: {
                name: item.institution.name,
                url: item.institution.url
            },
            country: {
                id: item.institution.city.state.country.id
            },
            last_update: item.last_update.toString(),
            total_score: Number(item.total_score),
            youtube_score: Number(item.youtube_score),
            twitter_score: Number(item.twitter_score),
            instagram_score: Number(item.instagram_score),
            facebook_score: Number(item.facebook_score),
        }
    });
}

type GetBestSocialMediaProps = {
    type: "youtube" | "twitter" | "instagram" | "facebook"
    lang: string
}
/**
 * Return best social media of all institutions
 * @returns 
 */
export const getBestSocialMedia = async ({ type, lang }: GetBestSocialMediaProps): Promise<BestSocialMediaItem | null> => { //

    const res = await prisma.institution_socials.findFirst({
        select: {
            institution_id: true,
            twitter_url: type === "twitter" ? true : false,
            twitter_data: type === "twitter" ? true : false,
            youtube_url: type === "youtube" ? true : false,
            youtube_data: type === "youtube" ? true : false,
            instagram_url: type === "instagram" ? true : false,
            instagram_data: type === "instagram" ? true : false,
            facebook_url: type === "facebook" ? true : false,
            facebook_data: type === "facebook" ? true : false,
            last_update: true,
            institution: {
                select: {
                    name: true,
                    url: true,
                    city: {
                        select: {
                            url: true,
                            state: {
                                select: {
                                    url: true,
                                    country: true
                                }
                            }
                        }
                    }
                }
            },
        },
        orderBy: {
            twitter_score: type === "twitter" ? 'desc' : undefined,
            youtube_score: type === "youtube" ? 'desc' : undefined,
            instagram_score: type === "instagram" ? 'desc' : undefined,
            facebook_score: type === "facebook" ? 'desc' : undefined,
        }
    })

    if (!res) return null;

    if (type === "twitter" && res.twitter_data) {
        const data = res.twitter_data as TwitterProfile;
        return {
            type: "twitter",
            institution_id: res.institution_id,
            institution: {
                name: res.institution.name,
                href: toLink(URL_INSTITUTION, res.institution.city.state.country.url, res.institution.url, URL_INSTITUTION_SOCIALMEDIA)
            },
            country: {
                name: getLocalizedName({ lang: lang, dbTranslated: res.institution.city.state.country }),
                href: toLink(URL_LOCATION, res.institution.city.state.country.url)
            },
            href: res.twitter_url,
            last_update: res.last_update.toString(),
            ...data,
        }
    } else if (type === "youtube" && res.youtube_data) {
        const data = res.youtube_data as YoutubeChannel;
        return {
            type: "youtube",
            institution_id: res.institution_id,
            institution: {
                name: res.institution.name,
                href: toLink(URL_INSTITUTION, res.institution.city.state.country.url, res.institution.url, URL_INSTITUTION_SOCIALMEDIA)
            },
            country: {
                name: getLocalizedName({ lang: lang, dbTranslated: res.institution.city.state.country }),
                href: toLink(URL_LOCATION, res.institution.city.state.country.url)
            },
            href: res.youtube_url,
            last_update: res.last_update.toString(),
            ...data,
        }
    }

    return null;
}

export const getSocialMedia = async (institutionId: string) => {
    return await prisma.institution_socials.findUnique({
        where: {
            institution_id: institutionId
        }
    });
}

export const getInstitutionTwitterData = async (institutionId: string) => {
    const res = await prisma.institution_socials.findUnique({
        where: {
            institution_id: institutionId
        },
        select: {
            twitter_data: true,
            twitter_url: true,
            twitter_score: true,
            last_update: true,
        }
    });

    return {
        ...res,
        twitter_data: res?.twitter_data ? res.twitter_data as TwitterProfile : null,
    }
}

export const getInstitutionYoutubeData = async (institutionId: string) => {
    const res = await prisma.institution_socials.findUnique({
        where: {
            institution_id: institutionId
        },
        select: {
            youtube_data: true,
            youtube_url: true,
            youtube_score: true,
            last_update: true,
        }
    });

    return {
        ...res,
        youtube_data: res?.youtube_data ? res.youtube_data as YoutubeChannel : null,
    }
}