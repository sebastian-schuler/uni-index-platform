import { InstitutionRegistrationDBItem } from '../types/AccountHandlingTypes';
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

    // TODO: Add preferred language to user
    return await prisma.user.create({
        data: {
            email: email,
            password: password,
            institution_id: institution_id,
            date_registered: date_registered,
            preferred_lang: "en"
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