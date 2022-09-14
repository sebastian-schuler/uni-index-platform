import { Country, SubjectType } from "@prisma/client";
import { getCitiesDetailedByState, getCountries, getCountriesByPopularity, getCountryInstitutionCount, getCountrySubjectCount, getSubjectsDetailedByInstitution, getSubjectTypes, getSubjectTypeSubjectCount } from "./prismaQueries";
import { DetailedCity, DetailedCountry, DetailedSubject, DetailedSubjectType } from "../types/DetailedDatabaseTypes";

// COUNTRIES

const loadDetailedCountries = async (countries: Country[]) => {
    return await Promise.all(countries.map(async (country) => {
        const institutionCount: number = await getCountryInstitutionCount(country.id);
        const subjectCount: number = await getCountrySubjectCount(country.id);
        return { ...country, institutionCount, subjectCount};
    }));
}

export const getDetailedCountries = async () => {
    const countries = await getCountries('desc');
    const detailed: DetailedCountry[] = await loadDetailedCountries(countries);
    return detailed;
}

export const getPopularDetailedCountries = async () => {
    const popularCountries = await getCountriesByPopularity(10);
    const detailed: DetailedCountry[] = await loadDetailedCountries(popularCountries);
    return detailed;
}

// SUBJECT TYPE

const loadDetailedSubjectTypes = async (subjectTypes: SubjectType[]) => {
    return await Promise.all(subjectTypes.map(async (type) => {
        const subjectCount: number = await getSubjectTypeSubjectCount(type.url);
        return { ...type, subjectCount};
    }));
}

export const getDetailedSubjectTypes = async () => {
    const types = await getSubjectTypes();
    const detailed:DetailedSubjectType[] = await loadDetailedSubjectTypes(types);
    return detailed;
}

// CITIES

export const getDetailedCities = async (stateUrl:string) => {
    const cities = await getCitiesDetailedByState(stateUrl);
    const detailed:DetailedCity[] = cities;
    return detailed;
}

// SUBJECTS

export const getDetailedSubjectsByInstitution = async (institutionId:string) => {
    const subjects = await getSubjectsDetailedByInstitution(institutionId);
    const detailed:DetailedSubject[] = subjects;
    return detailed;
}

// TODO move other detailed objects here, turn them into searchables aswell maybe?