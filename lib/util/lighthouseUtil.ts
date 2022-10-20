// CLIENT SIDE

import { LhrAudit, LhrCategory, MinifiedLhrReport } from "../types/lighthouse/CustomLhrTypes";
import Result from "../types/lighthouse/lhr";

export const LHR_SCORE_BREAKPOINTS = {
    good: 0.9,
    average: 0.5,
    poor: 0,
}

export const LHR_SCORE_COLORS = {
    good: '#51cf66',
    average: '#ff922b',
    poor: '#ff6b6b',
    informative: '#474747',
}

export const getLhrScoreColor = (score: number) => {
    if (score >= LHR_SCORE_BREAKPOINTS.good) {
        return 'green';
    }
    if (score >= LHR_SCORE_BREAKPOINTS.average) {
        return 'orange';
    }
    return 'red';
}

// SERVER SIDE

export const getMinifiedLhr = (lhrData: any) => {

    let lhrReport: MinifiedLhrReport = {
        audits: [],
        categories: [],
    }
    if (lhrData === null || lhrData === undefined) return lhrReport;

    const lhr = lhrData as Result;
    const lhrCategoryNames = ["performance", "accessibility", "best-practices", "seo", "pwa"];

    // AUDITS
    const audits: LhrAudit[] = [];
    Object.keys(lhr.audits).forEach((id) => {
        const audit = lhr.audits[id]

        if (audit !== undefined && audit.scoreDisplayMode !== "notApplicable" && audit.scoreDisplayMode !== "manual") {

            const passed =
                (audit.score === null || audit.score >= 0.9) &&
                (audit.scoreDisplayMode !== "informative" ||
                    (audit.scoreDisplayMode === "informative" && audit.details?.type === "table" && audit.details.headings.length === 0)
                );

            audits.push({
                id: audit.id,
                title: audit.title,
                scoreDisplayMode: audit.scoreDisplayMode,
                score: audit.score,
                displayValue: audit.displayValue || null,
                type: audit.details?.type || null,
                passed: passed,
            });
        }
    });

    // CATEGORY: PERFORMANCE
    const performance = getPerformanceCategory(lhr, audits);

    lhrReport.categories.push(performance);
    lhrReport.audits = audits;

    return lhrReport;
}

const getPerformanceCategory = (lhr: Result, audits: LhrAudit[]): LhrCategory => {
    const performance = lhr.categories["performance"];

    const metricRefs: string[] = [];
    const opportunityRefs: string[] = [];
    const diagnosticRefs: string[] = [];
    const passedRefs: string[] = [];

    // Add metric refs
    performance.auditRefs.filter((auditRef) => auditRef.weight > 0).forEach((auditRef) => {
        metricRefs.push(auditRef.id);
    });

    // Add opportunity refs and passed refs
    for (const auditRef of performance.auditRefs) {

        if (auditRef.group === "metrics" || auditRef.group === "hidden") continue;

        const auditIndex = audits.findIndex(audit => audit.id === auditRef.id);
        const audit = audits[auditIndex];

        if (audit === undefined) continue;

        if (audit.passed) {
            passedRefs.push(audit.id);
        } else {
            if (opportunityRefs.includes(auditRef.id) === false && audit?.type === "opportunity") {
                opportunityRefs.push(auditRef.id);
            }
        }
    };

    for (const auditRef of performance.auditRefs) {

        if (opportunityRefs.includes(auditRef.id) || metricRefs.includes(auditRef.id) || passedRefs.includes(auditRef.id)) continue;


        if (auditRef.group !== "hidden")
            diagnosticRefs.push(auditRef.id);
    }

    return {
        id: performance.id,
        title: performance.title,
        score: performance.score || 0,
        metricRefs: metricRefs,
        opportunityRefs: opportunityRefs,
        diagnosticRefs: diagnosticRefs,
        passedRefs: passedRefs,
    }
}