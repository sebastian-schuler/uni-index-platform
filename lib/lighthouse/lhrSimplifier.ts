import fs from 'fs/promises';
import { getInstitutionDetailed } from '../prisma/prismaDetailedQueries';
import { DetailedInstitution } from '../types/DetailedDatabaseTypes';
import { LhrInstitution, LhrSimple } from '../types/lighthouse/CustomLhrTypes';
import { URL_INSTITUTION, URL_INSTITUTION_ONLINEMARKETING } from '../url-helper/urlConstants';
import { toLink } from '../util/util';
import { getMinifiedLhrCategory } from './lhrParser';

export const getLhrSimplified = async (id: string) => {

    // const rawFile = await fs.readFile(`data/lighthouse/lhr-${id}.json`, "utf-8");
    const rawFile = await fs.readFile(`data/lighthouse/lhr-HSKL.json`, "utf-8");
    const parsedFile = JSON.parse(rawFile);
    const lhReport = await getMinifiedLhrCategory(parsedFile);

    const institution = id ? await getInstitutionDetailed(id) : null;

    if (!institution) return null;

    const report: LhrSimple = {
        institution: convertToLhrInstitution(institution),
        total: 0,
        performanceScore: lhReport.categories[0].score || 0,
        seoScore: lhReport.categories[1].score || 0,
        bestPracticesScore: lhReport.categories[2].score || 0,
        accessibilityScore: lhReport.categories[3].score || 0,
        pwaScore: 0,
    }
    report.total = (report.performanceScore + report.accessibilityScore + report.bestPracticesScore + report.seoScore + report.pwaScore) / 5;
    return report;
}

export const getAllLhrSimplified = async (count: number) => {

    // Get all json files in the lighthouse folder
    const fileNames = (await fs.readdir('data/lighthouse')).filter(file => file.endsWith('.json'));
    let reports: LhrSimple[] = [];

    for (const fileName of fileNames) {
        const idMatch = fileName.match(/lhr-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}).json/i);
        const id = idMatch ? idMatch[1] : null;
        const report = id ? (await getLhrSimplified(id)) : null;
        if (report) reports.push(report);
    }

    // Filter out reports with a total score of 0 and sort them by total score
    reports = reports.filter((report) => report.total > 0);
    reports.sort((a, b) => b.total - a.total);
    reports = reports.slice(0, count <= reports.length ? count : reports.length);

    return reports;
}

const convertToLhrInstitution = (institution: DetailedInstitution) => {

    const lhInstitution: LhrInstitution = {
        id: institution.id,
        name: institution.name,
        slug: toLink(URL_INSTITUTION, institution.City.State.Country.url, institution.url, URL_INSTITUTION_ONLINEMARKETING),
        website: institution.website,
    }

    return lhInstitution;
}