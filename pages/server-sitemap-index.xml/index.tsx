import { getServerSideSitemapIndexLegacy } from 'next-sitemap'
import { GetServerSideProps } from 'next'
import { CATEGORY_PER_PAGE } from '../categories';
import { getDetailedSubjectTypes } from '../../lib/prisma/prismaDetailedQueries';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // Method to source urls from cms
    const limit = CATEGORY_PER_PAGE;
    const detailedSubjectTypes = await getDetailedSubjectTypes();
    const pageCount = Math.ceil(detailedSubjectTypes.length / limit);

    const result: string[] = []

    // Add every page to the result array
    for (let i = 0; i < pageCount; i++) {
        result.push(`${process.env.SITE_URL}/categories?page=${i + 1}`)
    }

    return getServerSideSitemapIndexLegacy(ctx, result);
}

// Default export to prevent next.js errors
export default function SitemapIndex() { }