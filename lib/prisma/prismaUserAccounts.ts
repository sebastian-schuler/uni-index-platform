import { user_ad } from '@prisma/client';
import { InstitutionRegistrationDBItem, PremiumAdDetailed } from '../types/AccountHandlingTypes';
import prisma from './prisma';

// ===========================================================
// ================= USER ACCOUNT MANAGEMENT =================
// ===========================================================

// Get the user object belonging to the given email
export const getUserLogin = async (email: string) => {
    return await prisma.user.findUnique({
        select: {
            id: true,
            email: true,
            password: true,
        },
        where: {
            email: email
        }
    })
}

export const addUserSession = async (token: string, userId: string, validUntil: number) => {

    return await prisma.user_session.create({
        data: {
            token: token,
            user_id: userId,
            lifetime: validUntil
        }
    })

}

export const removeUserSession = async (token: string) => {
    return await prisma.user_session.delete({
        where: { token: token }
    });
}

export const getUserFromToken = async (token: string) => {

    return await prisma.user_session.findUnique({
        where: {
            token: token
        },
        select: {
            lifetime: true,
            user: {
                select: {
                    email: true,
                    id: true,
                }
            }
        }
    })

}

export const getSessionByToken = async (token: string) => {

    return await prisma.user_session.findUnique({
        where: {
            token: token
        }
    })

}

export const addNewUser = async (email: string, password: string, institution_id: string, date_registered: number) => {

    return await prisma.user.create({
        data: {
            email: email,
            password: password,
            institution_id: institution_id,
            date_registered: date_registered
        }
    })

}

export const getUserCountByEmail = async (email: string) => {

    return await prisma.user.count({
        where: {
            email: email
        }
    })

}

export const getUserCountByInstitution = async (institutionID: string) => {

    return await prisma.user.count({
        where: {
            institution_id: institutionID
        }
    })

}

export const getAdsByUser = async (userId: string) => {
    return await prisma.user_ad.findMany({
        include: { subject: true, },
        where: { user_id: userId }
    })
}

// Used for registration: 
export const getInstitutesForUserAccounts = async (): Promise<InstitutionRegistrationDBItem[]> => {
    return await prisma.institution.findMany({
        select: {
            id: true,
            name: true,
            user: {
                select: {
                    _count: {
                        select: { user_session: true }
                    }
                }
            }
        }
    })
}

export const getInstitutionByUser = async (institutionId: string) => {
    return await prisma.user.findUnique({
        include: {
            institution: {
                include: {
                    institution_city: {
                        select: {
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
                    }
                }
            }
        },
        where: { id: institutionId }
    });
}

type NewAdProps = {
    title: { [key: string]: string } | undefined
    booked_from: number
    booked_until: number
    type: string
    size: number
    date_booked: number
    placement: string[]
    user_id: string
    subject_id: string | null
    description: string | null
    image_id: string | null
}

export const addNewAd = async (props: NewAdProps) => {

    return await prisma.user_ad.create({
        data: {
            title: props.title,
            booked_from: props.booked_from,
            booked_until: props.booked_until,
            type: props.type,
            size: props.size,
            placement: props.placement,
            user_id: props.user_id,
            subject_id: props.subject_id,
            description: props.description,
            image_id: props.image_id,
            date_booked: props.date_booked
        }
    })
}

// Used for creating subject ads
export const getSubjectsByInstitute = async (institutionId: string) => {

    return await prisma.user.findUnique({
        select: { institution: { include: { subject: true } } },
        where: { id: institutionId }
    });

}

/**
 * Used in create ad to get the name of the institution
 * @param token 
 */
export const getInstitutionDataFromToken = async (token: string) => {
    return await prisma.user_session.findUnique({
        where: {
            token: token
        },
        select: {
            lifetime: true,
            user: {
                select: {
                    institution: {
                        select: {
                            name: true,
                            subject: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}