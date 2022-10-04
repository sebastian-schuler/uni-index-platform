import { LinkableCity, LinkableInstitution, LinkableSubject } from '../types/Linkables';
import prisma from './prisma';

// ===========================================================
// ================= GLOBAL SEARCH FUNCTION =================
// ===========================================================

export const getGlobalSearchResults = async (searchTerm: string) => {

    const subjects: LinkableSubject[] = await prisma.subject.findMany({
        select: {
            url: true,
            name: true,
            SubjectHasSubjectTypes: {
                select: {
                    SubjectType: {
                        select: {
                            url: true
                        }
                    }
                }
            }
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
