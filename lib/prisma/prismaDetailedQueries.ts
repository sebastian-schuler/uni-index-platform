import { Country, SubjectType } from "@prisma/client";
import prisma from './prisma';
import { getCountries, getSubjectTypes } from "./prismaQueries";
import { DetailedCity, DetailedCountry, DetailedInstitution, DetailedState, DetailedSubject, DetailedSubjectType } from "../types/DetailedDatabaseTypes";
import { getCountriesByPopularity } from "./prismaPopularQueries";

// ===========================================================
// ================= COUNTRY =============
// ===========================================================

const loadDetailedCountries = async (countries: Country[]) => {
    return await Promise.all(countries.map(async (country) => {
        const institutionCount: number = await getCountryInstitutionCount(country.id);
        const subjectCount: number = await getCountrySubjectCount(country.id);
        return { ...country, institutionCount, subjectCount };
    }));
}

export const getDetailedCountries = async () => {
    const countries = await getCountries('desc');
    const detailed: DetailedCountry[] = await loadDetailedCountries(countries);
    return detailed;
}

export const getPopularDetailedCountries = async () => {
    const popularCountries = await getCountriesByPopularity(10);
    const detailed: DetailedCountry[] = await loadDetailedCountries(popularCountries);
    return detailed;
}

// Return the amount of subjects in a specific country
const getCountrySubjectCount = async (id: string): Promise<number> => {
    return await prisma.subject.count({
        where: {
            City: {
                State: {
                    Country: {
                        id: id
                    }
                }
            }
        }
    })
}

// Return the amount of institutes in a specific country
const getCountryInstitutionCount = async (id: string): Promise<number> => {
    return await prisma.institution.count({
        where: {
            InstitutionLocation: {
                some: {
                    City: {
                        State: {
                            Country: {
                                id: id
                            }
                        }
                    }
                }
            }
        }
    })
}

// ===========================================================
// ================= SUBJECT TYPE =============
// ===========================================================

const loadDetailedSubjectTypes = async (subjectTypes: SubjectType[]) => {
    return await Promise.all(subjectTypes.map(async (type) => {
        const subjectCount: number = await getSubjectTypeSubjectCount(type.url);
        return { ...type, subjectCount };
    }));
}

export const getDetailedSubjectTypes = async () => {
    const types = await getSubjectTypes();
    const detailed: DetailedSubjectType[] = await loadDetailedSubjectTypes(types);
    return detailed;
}

// Return the amount of subjects of a specific type
const getSubjectTypeSubjectCount = async (subjectCategoryUrl: string): Promise<number> => {
    return await prisma.subject.count({
        where: {
            SubjectHasSubjectTypes: {
                some: {
                    SubjectType: {
                        url: subjectCategoryUrl
                    }
                }
            }
        }
    })
}

// ===========================================================
// ================= CITY =============
// ===========================================================

export const getDetailedCities = async (stateUrl: string) => {
    const cities = await getCitiesDetailedByState(stateUrl);
    const detailed: DetailedCity[] = cities;
    return detailed;
}

export const getCitiesDetailedByState = async (stateUrl: string): Promise<DetailedCity[]> => {
    return await prisma.city.findMany({
        where: {
            State: { url: stateUrl }
        },
        include: {
            State: {
                include: {
                    Country: true
                }
            },
            _count: {
                select: {
                    Subject: true,
                    InstitutionLocation: true
                }
            }
        },
        orderBy: {
            name: "asc"
        }
    });
}

// ===========================================================
// ================= SUBJECT =============
// ===========================================================

export const getDetailedSubjectsByInstitution = async (institutionId: string) => {
    const subjects = await getSubjectsDetailedByInstitution(institutionId);
    const detailed: DetailedSubject[] = subjects;
    return detailed;
}

// Return DetailedSubjects, where institutionId is parameter
const getSubjectsDetailedByInstitution = async (institutionId: string): Promise<DetailedSubject[]> => {

    return await prisma.subject.findMany({
        include: {
            SubjectHasSubjectTypes: {
                include: {
                    SubjectType: true
                }
            },
            Institution: true,
            City: {
                include: {
                    State: {
                        select: { Country: true }
                    }
                }
            }
        },
        where: {
            institution_id: institutionId
        }
    });
}

/**
 * Return a single DetailedSubject, by subject url and institution id
 * @param subjectUrl 
 * @param institutionId 
 */
export const getSubjectDetailedByUrl = async (subjectUrl: string, institutionId: string): Promise<DetailedSubject | null> => {
    return await prisma.subject.findUnique({
        include: {
            SubjectHasSubjectTypes: {
                include: {
                    SubjectType: true
                }
            },
            Institution: true,
            City: {
                include: {
                    State: {
                        select: { Country: true }
                    }
                }
            }
        },
        where: {
            url_institution_id: {
                url: subjectUrl,
                institution_id: institutionId,
            }
        }
    });
}

// Return DetailedSubjects, where SubjectType is URL parameter 
export const getSubjectsDetailedByCategory = async (subjectCategoryUrl: string): Promise<DetailedSubject[]> => {
    return await prisma.subject.findMany({
        include: {
            SubjectHasSubjectTypes: {
                include: {
                    SubjectType: true
                }
            },
            Institution: true,
            City: {
                include: {
                    State: {
                        select: { Country: true }
                    }
                }
            }
        },
        where: {
            SubjectHasSubjectTypes: {
                some: {
                    SubjectType: {
                        url: subjectCategoryUrl
                    }
                }
            }
        }
    });
}

// ===========================================================
// ================= STATE =============
// ===========================================================

// Return DetailedSubjects, where SubjectType is URL parameter 
export const getStatesDetailedByCountry = async (countryUrl: string): Promise<DetailedState[]> => {
    return await prisma.state.findMany({
        include: {
            _count: {
                select: {
                    City: true
                }
            },
            City: {
                take: 3,
                orderBy: {
                    popularity_score: "desc"
                }
            },
            Country: {
                select: {
                    url: true,
                }
            }
        },
        where: {
            Country: {
                url: countryUrl
            }
        },
        orderBy: [
            { popularity_score: "desc" },
            { name_native: "asc" }
        ]
    });
}

// ===========================================================
// ================= INSTITUTION =============
// ===========================================================

export const getInstitutionsDetailedByCountry = async (countryId: string): Promise<DetailedInstitution[]> => {
    return await prisma.institution.findMany({
        include: {
            City: {
                include: { State: { select: { Country: true } } },
            },
            Subject: {
                include: {
                    SubjectHasSubjectTypes: {
                        include: {
                            SubjectType: true
                        }
                    },
                }
            },
            InstitutionLocation: {
                select: {
                    City: {
                        include: { State: { include: { Country: true } } }
                    }
                }
            },
            _count: {
                select: {
                    Subject: true
                }
            }
        },
        where: {
            OR: [
                {
                    City: { State: { Country: { id: countryId } } }
                },
                {
                    InstitutionLocation: {
                        some: {
                            City: { State: { Country: { id: countryId } } }
                        }
                    }
                }
            ]
        }
    })
}

/**
 * 
 * @param cityId 
 */
export const getInstitutionsDetailedByCity = async (cityId: string): Promise<DetailedInstitution[]> => {
    return await prisma.institution.findMany({
        include: {
            City: {
                include: { State: { select: { Country: true } } },
            },
            Subject: {
                include: {
                    SubjectHasSubjectTypes: {
                        include: {
                            SubjectType: true
                        }
                    },
                }
            },
            InstitutionLocation: {
                select: {
                    City: {
                        include: { State: { include: { Country: true } } }
                    }
                }
            },
            _count: {
                select: {
                    Subject: true
                }
            }
        },
        where: {
            OR: [
                {
                    main_location: {
                        equals: cityId
                    }
                },
                {
                    InstitutionLocation: {
                        some: {
                            city_id: {
                                equals: cityId
                            }
                        }
                    }
                }
            ]
        }
    })
}