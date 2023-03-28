import { DetailedInstitution, DetailedSubject } from '../types/DetailedDatabaseTypes';
import prisma from './prisma';

// Return some subjects, ordered by popularity 
export const getSubjectsByPopularity = async (takeCount: number): Promise<DetailedSubject[]> => {
    return await prisma.subject.findMany({
        take: takeCount,
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