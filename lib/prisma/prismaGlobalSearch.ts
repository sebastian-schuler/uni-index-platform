import { Country } from '@prisma/client';
import { SearchedCityResult, SearchedInstitutionResult, SearchedStateResult, SearchedSubjectResult, SearchResult } from '../types/SearchTypes';
import { convertCityToSearchResult, convertCountryToSearchResult, convertInstitutionToSearchResult, convertStateToSearchResult, convertSubjectToSearchResult } from '../util/searchUtil';
import prisma from './prisma';

const likeStr = (searchTerm: string) => `%${searchTerm}%`;

// ===========================================================
// ================= GLOBAL SEARCH FUNCTION =================
// ===========================================================

export const prismaGlobalSearch = async (searchTerm: string, lang: string): Promise<SearchResult[]> => {

    console.log("TEST");

    // COUNTRY SEARCH
    const countryResults: Country[] = await prisma.$queryRaw`SELECT * FROM "Country" WHERE name ILIKE ${likeStr(searchTerm)};`
    // Convert to search result
    const countries = countryResults.map(country => convertCountryToSearchResult(country, lang));

    // STATE SEARCH
    const stateResults: SearchedStateResult[] = await prisma.$queryRaw`
        SELECT "State"."name_native", "State"."name_en", "State".url, "Country".url as "countryUrl", "Country".name as "countryName" FROM "State" 
        JOIN "Country" ON "State".country_id = "Country".id
        WHERE "State"."name_native" ILIKE ${likeStr(searchTerm)} 
        OR "State"."name_en" ILIKE ${likeStr(searchTerm)}
        LIMIT 50;`
    // Convert to search result
    const states = stateResults.map(state => convertStateToSearchResult(state, lang));

    // CITY SEARCH
    const cityResults: SearchedCityResult[] = await prisma.$queryRaw`
        SELECT "City".name, "City".url, "City".postcodes, 
        "State".url as "stateUrl", "State"."name_en" as "stateNameEn", "State"."name_native" as "stateNameNative",
        "Country".url as "countryUrl", "Country".name as "countryName"
        FROM "City" 
        JOIN "State" ON "City".state_id = "State".id
        JOIN "Country" ON "State".country_id = "Country".id
        WHERE "City".name ILIKE ${likeStr(searchTerm)} 
        OR ${searchTerm} = ANY(postcodes)
        LIMIT 50;`
    // Convert to search result
    const cities = cityResults.map(city => convertCityToSearchResult(city, lang));

    // INSTITUTION SEARCH
    const institutionResults: SearchedInstitutionResult[] = await prisma.$queryRaw`
        SELECT "Institution".name, "Institution".url 
        FROM "Institution" 
        WHERE name ILIKE ${likeStr(searchTerm)}
        LIMIT 50;`
    // Convert to search result
    const institutions = institutionResults.map(institution => convertInstitutionToSearchResult(institution, lang));

    // SUBJECT SEARCH
    const subjectResults: SearchedSubjectResult[] = await prisma.$queryRaw`
        SELECT "Subject".name, "Subject".url, "Institution".url as "institutionUrl", "Institution".name as "institutionName", 
        "Country".url as "countryUrl", "Country".name as "countryName"
        FROM "Subject" 
        JOIN "Institution" ON "Subject".institution_id = "Institution".id 
        JOIN "City" ON "Institution".main_location = "City".id
        JOIN "State" ON "City".state_id = "State".id
        JOIN "Country" ON "State".country_id = "Country".id
        WHERE "Subject".name ILIKE ${likeStr(searchTerm)}
        LIMIT 50;`
    // Convert to search result
    const subjects = subjectResults.map(subject => convertSubjectToSearchResult(subject, lang));

    return (
        [...countries,
        ...states,
        ...cities,
        ...institutions,
        ...subjects
        ]
    );
}