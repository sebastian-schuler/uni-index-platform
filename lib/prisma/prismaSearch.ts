import { Prisma, SubjectType } from '@prisma/client';
import { DetailedSubjectType } from '../types/DetailedDatabaseTypes';
import { OrderCategoryBy } from '../types/zod/zodOrderBy';
import prisma from './prisma';

const likeStr = (searchTerm: string) => `%${searchTerm}%`;

export const searchSubjectTypes = async (searchTerm: string | null, orderBy?: OrderCategoryBy) => {

    if (!orderBy) orderBy = 'az';

    const subjectResults: DetailedSubjectType[] = await prisma.$queryRaw`
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

    const result:DetailedSubjectType[] = subjectResults.map((subjectType) => {
        return {
            ...subjectType,
            subjectCount: Number(subjectType.subjectCount)
        }
    });

    return result;
}