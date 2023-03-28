import { SmRankingEntry, SocialMediaDBEntry } from '../types/SocialMediaTypes';
import prisma from './prisma';


// ===========================================================
// ================= SOCIAL MEDIA RANKING =================
// ===========================================================

export const getAllSocialMedia = async (): Promise<SocialMediaDBEntry[]> => {

    return await prisma.institution_socials.findMany({
        include: {
            institution: {
                include: {
                    city: {
                        include: {
                            state: {
                                include: { country: true }
                            }
                        }
                    }
                }
            }
        }
    })

}

export const getCountrySocialmedia = async (countryId: string) => {

    return await prisma.country_socials.findUnique({
        where: {
            country_id: countryId
        },
    })

}

//
export const getSocialMediaRanking = async (): Promise<SmRankingEntry[]> => {

    return await prisma.institution_socials.findMany({
        select: {
            institution_id: true,
            total_score: true,
            last_update: true,
            institution: {
                select: {
                    name: true,
                    url: true,
                    city: {
                        select: {
                            state: {
                                select: {
                                    country: true
                                }
                            }
                        }
                    }
                }
            },
        },
        orderBy: {
            total_score: 'desc'
        }
    })
}

export const getSocialMedia = async (institutionId: string) => {
    return await prisma.institution_socials.findUnique({
        where: {
            institution_id: institutionId
        }
    });
}