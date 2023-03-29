import { country } from '@prisma/client';
import { SearchedCityResult, SearchedInstitutionResult, SearchedStateResult, SearchedSubjectResult, SearchResult } from '../types/SearchTypes';
import { convertCityToSearchResult, convertCountryToSearchResult, convertInstitutionToSearchResult, convertStateToSearchResult, convertSubjectToSearchResult } from '../util/searchUtil';
import prisma from './prisma';

const likeStr = (searchTerm: string) => `%${searchTerm}%`;

export const prismaGlobalSearch = async (searchTerm: string, lang: string): Promise<SearchResult[]> => {

    // COUNTRY SEARCH
    const countryResults: country[] = await prisma.$queryRaw`SELECT * FROM country WHERE name ILIKE ${likeStr(searchTerm)};`
    // Convert to search result
    const countries = countryResults.map(country => convertCountryToSearchResult(country, lang));

    // STATE SEARCH
    const stateResults: SearchedStateResult[] = await prisma.$queryRaw`
        SELECT state.name_native, state.name_en, state.url, country.url as "countryUrl", country.name as "countryName" FROM state
        JOIN country ON state.country_id = country.id
        WHERE state.name_native ILIKE ${likeStr(searchTerm)} 
        OR state.name_en ILIKE ${likeStr(searchTerm)}
        LIMIT 50;`
    // Convert to search result
    const states = stateResults.map(state => convertStateToSearchResult(state, lang));

    // CITY SEARCH
    const cityResults: SearchedCityResult[] = await prisma.$queryRaw`
        SELECT city.name, city.url, city.postcodes, 
        state.url as stateUrl, state.name_en as "stateNameEn", state.name_native as "stateNameNative",
        country.url as "countryUrl", country.name as "countryName"
        FROM city
        JOIN state ON city.state_id = state.id
        JOIN country ON state.country_id = country.id
        WHERE city.name ILIKE ${likeStr(searchTerm)} 
        OR ${searchTerm} = ANY(postcodes)
        LIMIT 50;`
    // Convert to search result
    const cities = cityResults.map(city => convertCityToSearchResult(city, lang));

    // INSTITUTION SEARCH
    const institutionResults: SearchedInstitutionResult[] = await prisma.$queryRaw`
        SELECT institution.name, institution.url 
        FROM institution
        WHERE name ILIKE ${likeStr(searchTerm)}
        LIMIT 50;`
    // Convert to search result
    const institutions = institutionResults.map(institution => convertInstitutionToSearchResult(institution, lang));

    // SUBJECT SEARCH
    const subjectResults: SearchedSubjectResult[] = await prisma.$queryRaw`
        SELECT subject.name, subject.url, institution.url as "institutionUrl", institution.name as "institutionName", 
        country.url as "countryUrl", country.name as "countryName"
        FROM subject 
        JOIN institution ON subject.institution_id = institution.id 
        JOIN city ON institution.main_location = city.id
        JOIN state ON city.state_id = state.id
        JOIN country ON state.country_id = country.id
        WHERE subject.name ILIKE ${likeStr(searchTerm)}
        LIMIT 50;`
    // Convert to search result
    const subjects = subjectResults.map(subject => convertSubjectToSearchResult(subject, lang));

    return (
        [
            ...countries,
            ...states,
            ...cities,
            ...institutions,
            ...subjects
        ]
    );
}