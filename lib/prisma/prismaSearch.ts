import { Institution, Prisma, Subject } from '@prisma/client';
import { DetailedSubjectType } from '../types/DetailedDatabaseTypes';
import { OrderCategoryBy } from '../types/OrderBy';
import prisma from './prisma';

const likeStr = (searchTerm: string) => `%${searchTerm}%`;

/**
 * This function is used to search for subject types based on a search term and order by
 * @returns an array of DetailedSubjectType objects
 */
export const searchSubjectTypes = async (searchTerm: string | null, orderBy?: OrderCategoryBy): Promise<DetailedSubjectType[]> => {

    // If no order by is specified, default to alphabetical order
    if (!orderBy) orderBy = 'az';

    // Query the database
    const dbResults: DetailedSubjectType[] = await prisma.$queryRaw`
    SELECT "id", "url", "name_en", "name_native", "popularity_score", "native_lang", COUNT("subject_type_id") AS "subjectCount" 
    FROM "SubjectType"
    LEFT JOIN "SubjectHasSubjectTypes"
    ON "SubjectType"."id" = "SubjectHasSubjectTypes"."subject_type_id"
    ${searchTerm ? Prisma.sql`
        WHERE "SubjectType"."name_en" ILIKE ${likeStr(searchTerm)}
        OR "SubjectType"."name_native" ILIKE ${likeStr(searchTerm)}
        ` : Prisma.empty}
    GROUP BY "SubjectType"."id"
    ${orderBy === 'az' ? Prisma.sql`ORDER BY "name_en" ASC` : Prisma.empty}
    ${orderBy === 'za' ? Prisma.sql`ORDER BY "name_en" DESC` : Prisma.empty}
    ${orderBy === 'popularity' ? Prisma.sql`ORDER BY "popularity_score" DESC` : Prisma.empty}
    ${orderBy === 'subject-count' ? Prisma.sql`ORDER BY "subjectCount" DESC` : Prisma.empty}
    `

    // Convert the subjectCount property from a bigint to a number
    const result: DetailedSubjectType[] = dbResults.map((subjectType) => {
        return {
            ...subjectType,
            subjectCount: Number(subjectType.subjectCount)
        }
    });

    return result;
}

/**
 * This function takes a search term and returns an array of subjects that match that search term. 
 * @param searchTerm 
 * @returns the id, name and popularity score of each subject.
 */
export const searchSubjects = async (searchTerm: string | null): Promise<Subject[]> => {

    const subjectResults: Subject[] = await prisma.$queryRaw`
    SELECT "id","name", "popularity_score" FROM "Subject"
    ${searchTerm ? Prisma.sql`
        WHERE "Subject"."name" ILIKE ${likeStr(searchTerm)}
        ` : Prisma.empty}
    `

    return subjectResults;
}

/**
 * This function takes a search term and returns an array of institutions that match that search term.
 * @param searchTerm 
 * @returns the id, name and popularity score of each institution
 */
export const searchInstitutions = async (searchTerm: string | null): Promise<Institution[]> => {

    const subjectResults: Institution[] = await prisma.$queryRaw`
    SELECT "id","name", "popularity_score" FROM "Institution"
    ${searchTerm ? Prisma.sql`
        WHERE "Institution"."name" ILIKE ${likeStr(searchTerm)}
        ` : Prisma.empty}
    `

    return subjectResults;
}