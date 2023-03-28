import { subject } from '@prisma/client';
import { DetailedUserAd } from '../types/DetailedDatabaseTypes';
import prisma from './prisma';

// ===========================================================
// ================= FULL DEFAULT GETTER FUNCTIONS ===========
// ===========================================================

// Return all countries, ordered by localized name
export const getCountries = async () => {
    return await prisma.country.findMany({
        orderBy: { name: "asc" }
    });
}

// Return all subject types, ordered by localized name
export const getSubjectTypes = async () => {
    return await prisma.category.findMany({
        orderBy: { name_en: "asc" }
    })
}

// Return all subject types, ordered by localized name
export const getSubjects = async (categoryId: number) => {
    return await prisma.subject.findMany({
        where: {
            subject_category: {
                some: {
                    subject_type_id: categoryId
                }
            }
        }
    })
}


// ===========================================================
// ============ SPECIFIED MANY GETTER FUNCTIONS ==============
// ===========================================================

/**
 * 
 * @param placementLocation 
 */
export const getAds = async (placementLocation: string): Promise<DetailedUserAd[]> => {
    return await prisma.user_ad.findMany({
        include: {
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
                { placement: { has: "all" } },
                { placement: { has: placementLocation } },
            ],
        }
    });
}

// ===========================================================
// ============ SPECIFIED SINGLE GETTER FUNCTIONS ============
// ===========================================================

// Return single State + corresponding Country, where State is URL parameter
export const getCountryStateByStateUrl = async (stateUrl: string) => {
    return await prisma.state.findUnique({
        where: {
            url: stateUrl
        },
        select: {
            country: true
        }
    });
}

export const getCityStateCountryByCity = async (cityUrl: string) => {
    return await prisma.city.findUnique({
        where: {
            url: cityUrl
        },
        include: {
            state: {
                include: { country: true }
            }
        }
    });
}

export const getInstitutionsByCountry = async (countryId: string) => {
    return await prisma.institution.findMany({
        where: {
            city: { state: { country: { id: countryId } } }
        }
    });
}


// ===========================================================
// ================= SINGLE GETTER FUNCTIONS =================
// ===========================================================


export const getCountry = async (countryUrl: string) => {
    return await prisma.country.findUnique({
        where: {
            url: countryUrl
        }
    });
}

type GetInstitutionProps = { institutionUrl: string } | { institutionId: string }
export const getInstitution = async (props: GetInstitutionProps) => {

    // Make sure only one parameter is passed
    const url = "institutionUrl" in props ? props.institutionUrl : undefined;
    const id = "institutionId" in props ? props.institutionId : undefined;

    return await prisma.institution.findUnique({
        where: {
            url: url,
            id: id
        }
    });
}

export const getSubject = async (subjectUrl: string, institutionUrl: string): Promise<subject | null> => {

    const institutionId = (await getInstitutionIdByUrl(institutionUrl))?.id ?? null;

    // If no city/institution is found, return null
    if (institutionId === null) return null;

    return await prisma.subject.findUnique({
        where: {
            url_institution_id: {
                url: subjectUrl,
                institution_id: institutionId
            }
        },
    });


}

export const getSubjectType = async (subjectTypeUrl: string) => {

    return await prisma.category.findUnique({
        where: {
            url: subjectTypeUrl
        }
    });

}

export const getState = async (stateUrl: string) => {

    return await prisma.state.findUnique({
        where: {
            url: stateUrl
        }
    });

}

// ===========================================================
// ======================= HELPER ============================
// ===========================================================

const getInstitutionIdByUrl = async (url: string) => {
    return prisma.institution.findUnique({
        where: { url: url },
        select: { id: true }
    })
}

