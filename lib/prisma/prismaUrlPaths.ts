import prisma from './prisma';

// ===========================================================
// ================= PATH GETTER FUNCTIONS ===================
// ===========================================================

export const getInstitutionPaths = async () => {
    return await prisma.institution.findMany({
        select: {
            City: { select: { State: { select: { Country: true } } } },
            url: true,
            Subject: {
                select: {
                    City: {
                        select: {
                            State: {
                                select: {
                                    Country: { select: { url: true } }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}

export const getSubjectPaths = async () => {
    return await prisma.subject.findMany({
        select: {
            url: true,
            Institution: {
                select: {
                    url: true
                }
            },
            City: {
                select: {
                    State: {
                        select: {
                            Country: {
                                select: {
                                    url: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}

export const getCityStateCountryPaths = async () => {
    return await prisma.city.findMany({
        select: {
            url: true,
            State: {
                select: {
                    url: true,
                    Country: {
                        select: {
                            url: true
                        }
                    }
                }
            }
        }
    })
}