import { category, country, institution, subject, subject_category } from "@prisma/client";
import prisma from './prisma';
import { getCountries, getSubjectTypes } from "./prismaQueries";
import { DetailedCity, DetailedCountry, DetailedInstitution, DetailedState, DetailedSubject, DetailedSubjectType } from "../types/DetailedDatabaseTypes";
import { getCountriesByPopularity } from "./prismaPopularQueries";
import { OrderBy } from "../types/OrderBy";

// ===========================================================
// ================= COUNTRY =============
// ===========================================================

const loadDetailedCountries = async (countries: country[]) => {
    return await Promise.all(countries.map(async (country) => {
        const institutionCount: number = await getCountryInstitutionCount(country.id);
        const subjectCount: number = await getCountrySubjectCount(country.id);
        return { ...country, institutionCount, subjectCount };
    }));
}

export const getDetailedCountries = async () => {
    const countries = await getCountries();
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
            city: {
                state: {
                    country: {
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
            institution_city: {
                some: {
                    city: {
                        state: {
                            country: {
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

export const getDetailedSubjectTypes = async (source?: category[]) => {
    const types = source ? source : await getSubjectTypes();

    const detailed: DetailedSubjectType[] = await Promise.all(types.map(async (type) => {
        const subjectCount: number = await getSubjectTypeSubjectCount(type.url);
        return { 
            ...type,
            subject_count: subjectCount
        };
    }));

    return detailed;
}

// Return the amount of subjects of a specific type
const getSubjectTypeSubjectCount = async (subjectCategoryUrl: string): Promise<number> => {
    return await prisma.subject.count({
        where: {
            subject_category: {
                some: {
                    category: {
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
            state: { url: stateUrl }
        },
        include: {
            state: {
                include: {
                    country: true
                }
            },
            _count: {
                select: {
                    subject: true,
                    institution_city: true
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
            subject_category: {
                include: {
                    category: true
                }
            },
            institution: true,
            city: {
                include: {
                    state: {
                        select: {
                            url: true,
                            country: true
                        }
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
            subject_category: {
                include: {
                    category: true
                }
            },
            institution: true,
            city: {
                include: {
                    state: {
                        select: {
                            url: true,
                            country: true
                        }
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
export const getSubjectsDetailedByCategory = async (subjectCategoryUrl: string, orderBy: OrderBy, filteredSubjects?: subject[]): Promise<DetailedSubject[]> => {

    const subjectIds = filteredSubjects?.map((subject) => subject.id);

    return await prisma.subject.findMany({
        include: {
            subject_category: {
                include: {
                    category: true
                }
            },
            institution: true,
            city: {
                include: {
                    state: {
                        select: {
                            url: true,
                            country: true
                        }
                    }
                }
            }
        },
        where: {
            AND: {
                id: {
                    in: subjectIds
                },
                subject_category: {
                    some: {
                        category: {
                            url: subjectCategoryUrl
                        }
                    }
                }
            }
        },
        orderBy: {
            name: orderBy === "popularity" ? undefined : orderBy === "az" ? "asc" : "desc",
            popularity_score: orderBy === "popularity" ? "desc" : undefined
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
                    city: true,
                }
            },
            city: {
                select: {
                    _count: {
                        select: {
                            subject: true,
                        }
                    }
                }
            },
            country: {
                select: {
                    url: true,
                }
            }
        },
        where: {
            country: {
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

export const getInstitutionsDetailedByCountry = async (countryId: string, orderBy: OrderBy, filteredInstitutions?: institution[]): Promise<DetailedInstitution[]> => {

    const institutionIds = filteredInstitutions?.map((institution) => institution.id);

    return await prisma.institution.findMany({
        include: {
            institution_socials: {
                select: {
                    facebook_url: true,
                    instagram_url: true,
                    twitter_url: true,
                    youtube_url: true,
                }
            },
            city: {
                include: { state: { include: { country: true } } },
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
            institution_city: {
                select: {
                    city: {
                        include: { state: { include: { country: true } } }
                    }
                }
            },
            _count: {
                select: {
                    subject: true
                }
            }
        },
        where: {
            AND: {
                id: {
                    in: institutionIds
                },
                OR: [
                    {
                        city: { state: { country: { id: countryId } } }
                    },
                    {
                        institution_city: {
                            some: {
                                city: { state: { country: { id: countryId } } }
                            }
                        }
                    }
                ]
            }
        },
        orderBy: {
            name: orderBy === "popularity" ? undefined : orderBy === "az" ? "asc" : "desc",
            popularity_score: orderBy === "popularity" ? "desc" : undefined
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
            institution_socials: {
                select: {
                    facebook_url: true,
                    instagram_url: true,
                    twitter_url: true,
                    youtube_url: true,
                }
            },
            city: {
                include: { state: { include: { country: true } } },
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
            institution_city: {
                select: {
                    city: {
                        include: { state: { include: { country: true } } }
                    }
                }
            },
            _count: {
                select: {
                    subject: true
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
                    institution_city: {
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

/**
 * Get DetailedInstitution by institution id
 * @param institutionId 
 * @returns 
 */
export const getInstitutionDetailed = async (institutionId: string): Promise<DetailedInstitution | null> => {
    return await prisma.institution.findUnique({
        include: {
            institution_socials: {
                select: {
                    facebook_url: true,
                    instagram_url: true,
                    twitter_url: true,
                    youtube_url: true,
                }
            },
            city: {
                include: { state: { include: { country: true } } },
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
            institution_city: {
                select: {
                    city: {
                        include: { state: { include: { country: true } } }
                    }
                }
            },
            _count: {
                select: {
                    subject: true
                }
            }
        },
        where: {
            id: institutionId
        }
    })
}

/**
 * Get DetailedInstitution by internal url
 * @param institutionId 
 * @returns 
 */
export const getInstitutionDetailedByUrl = async (internalUrl: string): Promise<DetailedInstitution | null> => {
    return await prisma.institution.findUnique({
        include: {
            institution_socials: {
                select: {
                    facebook_url: true,
                    instagram_url: true,
                    twitter_url: true,
                    youtube_url: true,
                }
            },
            city: {
                include: { state: { include: { country: true } } },
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
            institution_city: {
                select: {
                    city: {
                        include: { state: { include: { country: true } } }
                    }
                }
            },
            _count: {
                select: {
                    subject: true
                }
            }
        },
        where: {
            url: internalUrl
        }
    })
}