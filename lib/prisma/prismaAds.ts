import { convertAdToCardData } from '../ads/adConverter';
import { AdPlacement, AdTitle, DetailedUserAd, ManagedAd } from '../types/Ads';
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
            AND: [
                {
                    booked_until: {
                        gt: Date.now()
                    }
                },
                {
                    booked_from: {
                        lt: Date.now()
                    }
                },
                {
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

export const getAdsByUser = async (userId: string) => {
    return await prisma.user_ad.findMany({
        include: { subject: true, },
        where: {
            user_id: userId,
        }
    })
}


export const getActiveAdsByUser = async (userId: string): Promise<ManagedAd[]> => {

    const res = await prisma.user_ad.findMany({
        include: { subject: true, },
        where: {
            user_id: userId,
            booked_until: {
                gt: Date.now()
            },
            booked_from: {
                lt: Date.now()
            }
        }
    })

    return res.map((item) => {
        return ({
            id: item.id,
            user_id: item.user_id,
            booked_from: Number(item.booked_from),
            booked_until: Number(item.booked_until),
            subject: item.subject ? {
                name: item.subject?.name,
            } : null,
            type: item.type,
            size: item.size,
            description: item.description,
            image_id: item.image_id,
            date_booked: Number(item.date_booked),
            placement: item.placement as AdPlacement,
            title: item.title as AdTitle,
        })
    });
}

export const getAdByUser = async (adId: string | null, userId: string): Promise<ManagedAd | null> => {

    if(!adId) return null;

    const res = await prisma.user_ad.findFirst({
        include: { subject: true, },
        where: {
            id: adId,
            user_id: userId,
        }
    })

    if (!res) return null;

    return ({
        id: res.id,
        user_id: res.user_id,
        booked_from: Number(res.booked_from),
        booked_until: Number(res.booked_until),
        subject: res.subject ? {
            name: res.subject?.name,
        } : null,
        type: res.type,
        size: res.size,
        description: res.description,
        image_id: res.image_id,
        date_booked: Number(res.date_booked),
        placement: res.placement as AdPlacement,
        title: res.title as AdTitle,
    });
}