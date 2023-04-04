import { convertAdToCardData } from '../ads/adConverter';
import { DetailedUserAd } from '../types/DetailedDatabaseTypes';
import { AdCardData } from '../types/UiHelperTypes';
import prisma from './prisma';

/**
 * 
 * @param placementLocation 
 */
export const getAds = async (placementLocation: string, lang: string): Promise<AdCardData[]> => {

    const resArr: DetailedUserAd[] = await prisma.user_ad.findMany({
        include: {
            user_image: {
                select: {
                    id: true,
                    filetype: true
                }
            },
            subject: {
                include: {
                    subject_category: {
                        include: {
                            category: true
                        }
                    },
                }
            },
            user: {
                select: {
                    institution: {
                        select: {
                            url: true,
                            name: true,
                            city: {
                                select: {
                                    state: {
                                        select: {
                                            country: { select: { url: true } }
                                        }
                                    }
                                }
                            },
                            institution_city: {
                                select: {
                                    city: {
                                        select: {
                                            name: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        where: {
            OR: [
                {
                    placement: {
                        path: ["generic"],
                        array_contains: [placementLocation],
                    },
                },
                {
                    placement: {
                        path: ["generic"],
                        array_contains: ["all"]
                    }
                }
            ]
        }
    });

    const cards = resArr.map((item) => convertAdToCardData(item, lang));
    return cards.filter((item) => item !== undefined) as AdCardData[];
}

type NewAdProps = {
    title: { [key: string]: string } | undefined
    booked_from: number
    booked_until: number
    type: string
    size: number
    placement: { generic: string[] }
    user_id: string
    subject_id: string | null
    description: string | null
    withImage: boolean
    filetype: string | null
}

export const addNewAd = async ({ title, booked_from, booked_until, type, size, placement, description, subject_id, user_id, withImage, filetype }: NewAdProps) => {

    return await prisma.user_ad.create({
        data: {
            title: title,
            booked_from: booked_from,
            booked_until: booked_until,
            type: type,
            size: size,
            placement: placement,
            description: description,
            date_booked: Date.now(),

            // Only connect if the subject_id is not null
            subject: subject_id ? {
                connect: {
                    id: subject_id,
                }
            } : undefined,

            user: {
                connect: {
                    id: user_id,
                }
            },

            // Only create if the user wants to upload an image
            user_image: withImage && filetype ? {
                create: {
                    filetype: filetype,
                    upload_date: Date.now(),
                }
            } : undefined
        },
        select: {
            id: true,
            user_image: {
                select: {
                    id: true,
                }
            }
        }
    })
}