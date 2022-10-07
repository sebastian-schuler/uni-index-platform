import { SmRankingEntry, SocialMediaDBEntry } from '../types/SocialMediaTypes';
import prisma from './prisma';


// ===========================================================
// ================= SOCIAL MEDIA RANKING =================
// ===========================================================

export const getAllSocialMedia = async (): Promise<SocialMediaDBEntry[]> => {

    return await prisma.institutionSocialMedia.findMany({
        include: {
            Institution: {
                include: {
                    City: {
                        include: {
                            State: {
                                include: { Country: true }
                            }
                        }
                    }
                }
            }
        }
    })

}

export const getCountrySocialmedia = async (countryId: string) => {

    return await prisma.countrySocialMedia.findUnique({
        where: {
            country_id: countryId
        },
    })

}

//
export const getSocialMediaRanking = async (): Promise<SmRankingEntry[]> => {

    return await prisma.institutionSocialMedia.findMany({
        select: {
            institution_id: true,
            total_score: true,
            last_update: true,
            Institution: {
                select: {
                    name: true,
                    url: true,
                    City: {
                        select: {
                            State: {
                                select: {
                                    Country: true
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
    return await prisma.institutionSocialMedia.findUnique({
        where: {
            institution_id: institutionId
        }
    });
}