import { Subject } from '@prisma/client';
import { DetailedUserAd } from '../types/DetailedDatabaseTypes';
import prisma from './prisma';

type OrderBy = "asc" | "desc";

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
    return await prisma.subjectType.findMany({
        orderBy: { name_en: "asc" }
    })
}

// ===========================================================
// ============ SPECIFIED MANY GETTER FUNCTIONS ==============
// ===========================================================

// Return Subjects + corresponding Institution, where SubjectName is parameter 
export const getSubjectsInstitutionByName = async (subjectName: string) => {
    return await prisma.subject.findMany({
        include: {
            Institution: true,
            City: {
                select: {
                    State: {
                        select: { Country: true }
                    }
                }
            }
        },
        where: {
            name: subjectName
        }
    });
}

// Return States + corresponding City+Country, where Country is URL parameter, order by localized name
export const getStatesCountryCityByCountry = async (locale: string, countryUrl: string, orderBy: OrderBy) => {
    return await prisma.state.findMany({
        include: {
            Country: true,
            City: true,
        },
        where: {
            Country: {
                url: {
                    equals: countryUrl
                }
            }
        },
        orderBy: {
            ["name_" + locale]: orderBy
        }
    })
}

// Return Cities, where State is URL parameter, order by name
export const getCitiesByState = async (stateUrl: string, orderBy: OrderBy) => {
    return await prisma.city.findMany({
        where: {
            State: {
                url: { equals: stateUrl }
            }
        },
        orderBy: {
            name: orderBy
        }
    })
}

// Return Institutes, where City is URL parameter, order by name
// TODO check if only select is appropriate
export const getInstitutesByCity = async (cityUrl: string, orderBy: OrderBy) => {
    return await prisma.institution.findMany({
        select: {
            id: true,
            name: true,
            url: true,
        },
        where: {
            Subject: {
                some: {
                    City: {
                        url: cityUrl
                    }
                }
            }
        },
        orderBy: {
            name: orderBy
        }
    })
}

/**
 * 
 * @param placementLocation 
 */
export const getAds = async (placementLocation: string): Promise<DetailedUserAd[]> => {
    return await prisma.userAd.findMany({
        include: {
            Subject: {
                include: {
                    SubjectHasSubjectTypes: {
                        include: {
                            SubjectType: true
                        }
                    },
                }
            },
            User: {
                select: {
                    Institution: {
                        select: {
                            url: true,
                            name: true,
                            City: {
                                select: {
                                    State: {
                                        select: {
                                            Country: { select: { url: true } }
                                        }
                                    }
                                }
                            },
                            InstitutionLocation: {
                                select: {
                                    City: {
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
// TODO rename
export const getCountryByState = async (stateUrl: string) => {
    return await prisma.state.findUnique({
        where: {
            url: stateUrl
        },
        select: {
            Country: true
        }
    });
}

// Return single Subject + corresponding Institution, where Subject is URL parameter
// TODO use this as template
export const getSubjectInstitutionBySubject = async (subjectUrl: string, institutionUrl: string) => {

    const institutionId = (await getInstitutionIdByUrl(institutionUrl))?.id ?? null;

    if (institutionId !== null) return null;

    return await prisma.subject.findUnique({
        where: {
            url_institution_id: {
                url: subjectUrl,
                institution_id: institutionId || ""
            }
        },
        include: {
            Institution: true
        }
    });
}

// Return single Subject + corresponding Institution, where Subject is URL parameter
// TODO Could return correct object directly?
export const getCountrySubjectBySubject = async (subjectUrl: string, institutionUrl: string) => {

    const institutionId = (await getInstitutionIdByUrl(institutionUrl))?.id ?? null;

    // If no city/institution is found, return null
    if (institutionId === null) return Promise<null>;

    return await prisma.subject.findUnique({
        select: {
            City: {
                select: {
                    State: {
                        select: {
                            Country: true
                        }
                    }
                }
            }
        },
        where: {
            url_institution_id: {
                url: subjectUrl,
                institution_id: institutionId
            }
        },
    });
}

export const getCityStateCountryByCity = async (cityUrl: string) => {
    return await prisma.city.findUnique({
        where: {
            url: cityUrl
        },
        include: {
            State: {
                include: { Country: true }
            }
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

export const getSubject = async (subjectUrl: string, institutionUrl: string): Promise<Subject | null> => {

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

    return await prisma.subjectType.findUnique({
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

