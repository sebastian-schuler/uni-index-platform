import { DetailedInstitution, DetailedSubject } from '../types/DetailedDatabaseTypes';
import prisma from './prisma';

// Return some subjects, ordered by popularity 
export const getSubjectsByPopularity = async (takeCount: number): Promise<DetailedSubject[]> => {
    return await prisma.subject.findMany({
        take: takeCount,
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
            InstitutionSocialMedia: {
                select: {
                    facebook_url: true,
                    instagram_url: true,
                    twitter_url: true,
                    youtube_url: true,
                }
            },
            City: {
                include: { State: { include: { Country: true } } },
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