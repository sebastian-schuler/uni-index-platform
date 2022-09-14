import { Subject } from '@prisma/client';
import prisma from './prisma';
import { InstitutionRegistrationDBItem } from "../types/AccountHandlingTypes";
import { DetailedInstitution, DetailedSubject, DetailedUserAd } from '../types/DetailedDatabaseTypes';
import { LinkableCity, LinkableInstitution, LinkableSubject } from "../types/Linkables";
import { SocialMediaDBEntry } from '../types/SocialMediaTypes';

type OrderBy = "asc" | "desc";

// ===========================================================
// ================= FULL DEFAULT GETTER FUNCTIONS ===========
// ===========================================================

// Return all countries, ordered by localized name
export const getCountries = async (orderBy: OrderBy) => {
    return await prisma.country.findMany({
        orderBy: {
            "name": orderBy
        }
    })
}

// Return all subject types, ordered by localized name
export const getSubjectTypes = async () => {
    return await prisma.subjectType.findMany({})
}

// ===========================================================
// ================= POPULARITY GETTER FUNCTIONS =============
// ===========================================================

// Return some subjects, ordered by popularity
export const getSubjectsByPopularity = async (takeCount: number): Promise<DetailedSubject[]> => {
    return await prisma.subject.findMany({
        take: takeCount,
        include: {
            SubjectType: true,
            Institution: true,
            City: {
                include: {
                    State: {
                        select: { Country: true }
                    }
                }
            }
        },
        orderBy: {
            "popularity_score": "desc"
        }
    })
}

// Return some institutes, ordered by popularity 
export const getInstitutionsByPopularity = async (takeCount: number): Promise<DetailedInstitution[]> => {
    return await prisma.institution.findMany({
        take: takeCount,
        include: {
            City: {
                include: { State: { select: { Country: true } } },
            },
            Subject: {
                include: {
                    SubjectType: true,
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
        orderBy: {
            "popularity_score": "desc"
        }
    })
}

// Return some countries, ordered by popularity
export const getCountriesByPopularity = async (takeCount: number) => {
    return await prisma.country.findMany({
        take: takeCount,
        orderBy: {
            "popularity_score": "desc"
        }
    })
}

// Return the amount of institutes in a specific country
export const getCountryInstitutionCount = async (id: string) => {
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

// Return the amount of subjects in a specific country
export const getCountrySubjectCount = async (id: string) => {
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

// Return the amount of subjects of a specific type
export const getSubjectTypeSubjectCount = async (typeUrl: string) => {
    return await prisma.subject.count({
        where: {
            SubjectType: {
                url: typeUrl
            }
        }
    })
}

// ===========================================================
// ============ DETAILED ITEM GETTER FUNCTIONS ===============
// ===========================================================

// Return DetailedSubjects, where SubjectType is URL parameter 
export const getSubjectsDetailedByCategory = async (subjectCategoryUrl: string): Promise<DetailedSubject[]> => {
    return await prisma.subject.findMany({
        include: {
            SubjectType: true,
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
            SubjectType: {
                url: subjectCategoryUrl
            }
        }
    });
}

// Return DetailedSubjects, where institutionId is parameter
export const getSubjectsDetailedByInstitution = async (institutionId: number): Promise<DetailedSubject[]> => {

    return await prisma.subject.findMany({
        include: {
            SubjectType: true,
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

// Return DetailedSubjects, where SubjectType is URL parameter 
export const getStatesDetailedByCountry = async (countryUrl: string) => {
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

export const getInstitutionsDetailedByCity = async (cityId: number): Promise<DetailedInstitution[]> => {
    return await prisma.institution.findMany({
        include: {
            City: {
                include: { State: { select: { Country: true } } },
            },
            Subject: {
                include: {
                    SubjectType: true,
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

export const getInstitutionsDetailedByCountry = async (countryId: string): Promise<DetailedInstitution[]> => {
    return await prisma.institution.findMany({
        include: {
            City: {
                include: { State: { select: { Country: true } } },
            },
            Subject: {
                include: {
                    SubjectType: true,
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

export const getCitiesDetailedByState = async (stateUrl: string) => {
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

// Return Ads
export const getAds = async (placementLocation: string): Promise<DetailedUserAd[]> => {
    return await prisma.userAd.findMany({
        include: {
            Subject: {
                include: {
                    SubjectType: true
                }
            },
            User: {
                include: {
                    Institution: {
                        include: {
                            City: { include: { State: { include: { Country: true } } } },
                            InstitutionLocation: { include: { City: true } }
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
        },
        orderBy: {
            level: "desc"
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

    return await prisma.subject.findUnique({
        where: {
            url_institution_id: {
                url: subjectUrl,
                institution_id: institutionId || -1
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

export const getSubjectSubjectTypePaths = async () => {
    return await prisma.subject.findMany({
        include: {
            SubjectType: true
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

export const getInstitution = async (institutionUrl: string) => {
    return await prisma.institution.findUnique({
        where: {
            url: institutionUrl
        }
    });
}

export const getSocialMedia = async (institutionId: number) => {
    return await prisma.institutionSocialMedia.findUnique({
        where: {
            institution_id: institutionId
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

export const addUserSession = async (token: string, userId: bigint, validUntil: number) => {

    return await prisma.userSessionID.create({
        data: {
            token: token,
            user_id: userId,
            lifetime: validUntil
        }
    })

}

export const removeUserSession = async (token: string) => {
    return await prisma.userSessionID.delete({
        where: { token: token }
    });
}

export const getUserFromToken = async (token: string) => {

    return await prisma.userSessionID.findUnique({
        where: {
            token: token
        },
        select: {
            lifetime: true,
            User: {
                select: {
                    email: true,
                    id: true,
                }
            }
        }
    })

}

export const getSessionByToken = async (token: string) => {

    return await prisma.userSessionID.findUnique({
        where: {
            token: token
        }
    })

}

export const addNewUser = async (email: string, password: string, institution_id: number) => {

    return await prisma.user.create({
        data: {
            email: email,
            password: password,
            institution_id: institution_id,
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

export const getUserCountByInstitution = async (institutionID: number) => {

    return await prisma.user.count({
        where: {
            institution_id: institutionID
        }
    })

}

export const getAdsByUser = async (userId: bigint) => {
    return await prisma.userAd.findMany({
        include: { Subject: true, },
        where: { user_id: userId }
    })
}

// Used for registration
export const getInstitutesForUserAccounts = async (): Promise<InstitutionRegistrationDBItem[]> => {
    return await prisma.institution.findMany({
        select: {
            id: true,
            name: true,
            User: {
                select: {
                    _count: {
                        select: { UserSessionID: true }
                    }
                }
            }
        }
    })
}

export const getInstitutionByUser = async (institutionId: number) => {
    return await prisma.user.findUnique({
        include: {
            Institution: {
                include: {
                    InstitutionLocation: {
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
                        }
                    }
                }
            }
        },
        where: { id: institutionId }
    });
}

export const addNewAd = async (
    level: number, booked_until: number, type: string, size: number,
    placement: string[], user_id: number, subject_id: number, description: string, image_id: string
) => {

    return await prisma.userAd.create({
        data: {
            level: level,
            booked_until: booked_until,
            type: type,
            size: size,
            placement: placement,
            user_id: user_id,
            subject_id: subject_id,
            description: description,
            image_id: image_id,
        }
    })

}

// Used for creating subject ads
export const getSubjectsByInstitute = async (institutionId: bigint) => {

    return await prisma.user.findUnique({
        select: { Institution: { include: { Subject: true } } },
        where: { id: institutionId }
    });

}

// ===========================================================
// ================= GLOBAL SEARCH FUNCTION =================
// ===========================================================

export const getGlobalSearchResults = async (searchTerm: string) => {

    const subjects: LinkableSubject[] = await prisma.subject.findMany({
        select: {
            url: true,
            name: true,
            SubjectType: { select: { url: true } }
        },
        where: { name: { search: searchTerm } }
    });

    const institutions: LinkableInstitution[] = await prisma.institution.findMany({
        select: {
            name: true,
            url: true,
            InstitutionLocation: {
                select: {
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
            }
        },
        where: {
            name: {
                search: searchTerm
            }
        }
    });

    const cities: LinkableCity[] = await prisma.city.findMany({
        select: {
            name: true,
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
        },
        where: {
            name: {
                search: searchTerm
            }
        }
    });

    return { subjects, institutions, cities };
}

// ===========================================================
// ================= SOCIAL MEDIA RANKING =================
// ===========================================================

export const getAllSocialMedia = async (): Promise<SocialMediaDBEntry[]> => {

    return await prisma.institutionSocialMedia.findMany({
        include: {
            Institution: {
                include:{
                    City: {
                        include: {
                            State: {
                                include: { Country: true }
                            }
                        }
                    }
                }
            }
        }
    })

}

// ===========================================================
// ======================= HELPER ============================
// ===========================================================

const getCityIdByUrl = async (url: string) => {
    return prisma.city.findUnique({
        where: { url: url },
        select: { id: true }
    })
}

const getInstitutionIdByUrl = async (url: string) => {
    return prisma.institution.findUnique({
        where: { url: url },
        select: { id: true }
    })
}

