import { SubjectType } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getServerSideSitemapIndexLegacy } from 'next-sitemap';
import { getCountries, getInstitutionsByCountry, getSubjects, getSubjectTypes } from '../../lib/prisma/prismaQueries';
import { URL_CATEGORIES, URL_CATEGORY, URL_INSTITUTION } from '../../lib/url-helper/urlConstants';
import { CATEGORY_PER_PAGE } from '../categories';
import { INSTITUTIONS_PER_PAGE } from '../institution/[Country]';

/**
 * Get all pages of each category
 */
const getCategoryPages = async (categories: SubjectType[]) => {
    const pageCount = Math.ceil(categories.length / CATEGORY_PER_PAGE);

    const result: string[] = []
    for (let i = 0; i < pageCount; i++) {
        const pageNumber = i === 0 ? "" : `?page=${i + 1}`;
        result.push(`${process.env.SITE_URL}/${URL_CATEGORIES}${pageNumber}`)
    }
    return result;
}

/**
 * Get all pages of each subject in each category
 */
const getSubjectPages = async (categoryId: number, categoryUrl: string) => {
    const detailedSubjectTypes = await getSubjects(categoryId);
    const pageCount = Math.ceil(detailedSubjectTypes.length / CATEGORY_PER_PAGE);

    const result: string[] = []
    for (let i = 1; i <= pageCount; i++) {
        const pageNumber = i === 1 ? "" : `?page=${i}`;
        result.push(`${process.env.SITE_URL}/${URL_CATEGORY}/${categoryUrl}${pageNumber}`)
    }
    return result;
}

/**
 * Get all pages of each countries institution list
 */
const getCountryInstitutionPages = async (countryId: string, countryUrl: string) => {
    const institutions = await getInstitutionsByCountry(countryId);
    const pageCount = Math.ceil(institutions.length / INSTITUTIONS_PER_PAGE);

    const result: string[] = []
    for (let i = 1; i <= pageCount; i++) {
        const pageNumber = i === 1 ? "" : `?page=${i}`;
        result.push(`${process.env.SITE_URL}/${URL_INSTITUTION}/${countryUrl}${pageNumber}`)
    }
    return result;
}

// Method to source urls from cms
export const getServerSideProps: GetServerSideProps = async (ctx) => {

    // Get all categories
    const categories = await getSubjectTypes();

    // Get all pages of each category
    const categoryPages = await getCategoryPages(categories);

    // Get all pages of each subject in each category
    const subjectPages: string[] = []
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const pages = await getSubjectPages(category.id, category.url);
        subjectPages.push(...pages);
    }

    // Get all countries
    const countryPages: string[] = []
    const countries = await getCountries();
    for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        const pages = await getCountryInstitutionPages(country.id, country.url);
        countryPages.push(...pages);
    }

    const result = [...categoryPages, ...countryPages, ...subjectPages];

    return getServerSideSitemapIndexLegacy(ctx, result);
}

// Default export to prevent next.js errors
export default function SitemapIndex() { }