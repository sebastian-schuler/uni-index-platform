import prisma from './prisma';

// ===========================================================
// ================= PATH GETTER FUNCTIONS ===================
// ===========================================================

export const getInstitutionPaths = async () => {
    return await prisma.institution.findMany({
        select: {
            city: { select: { state: { select: { country: true } } } },
            url: true,
            subject: {
                select: {
                    city: {
                        select: {
                            state: {
                                select: {
                                    country: { select: { url: true } }
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
            institution: {
                select: {
                    url: true
                }
            },
            city: {
                select: {
                    state: {
                        select: {
                            country: {
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
            state: {
                select: {
                    url: true,
                    country: {
                        select: {
                            url: true
                        }
                    }
                }
            }
        }
    })
}