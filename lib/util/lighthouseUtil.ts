// CLIENT SIDE

import { AuditResult } from "../types/lighthouse/audit-result";
import { LhrAudit, LhrAuditDetails, LhrCategory, MinifiedLhrReport } from "../types/lighthouse/CustomLhrTypes";
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
        const audit: AuditResult = lhr.audits[id]

        if (audit !== undefined && audit.scoreDisplayMode !== "manual" && (audit.scoreDisplayMode !== "notApplicable" || audit.details !== undefined)) {

            const passed =
                (audit.score === null || audit.score >= 0.9) &&
                (audit.scoreDisplayMode !== "informative" ||
                    (audit.scoreDisplayMode === "informative" && audit.details?.type === "table" && audit.details.headings.length === 0)
                );

            audits.push({
                id: audit.id,
                title: audit.title,
                scoreDisplayMode: audit.scoreDisplayMode,
                description: audit.description,
                score: audit.score,
                displayValue: audit.displayValue || null,
                passed: passed,
                details: getDetailsObject(audit),
            });
        }
    });

    // CATEGORY: PERFORMANCE
    const performance = getPerformanceCategory(lhr, audits);

    lhrReport.categories.push(performance);
    lhrReport.audits = audits;

    return lhrReport;
}

const getDetailsObject = (audit: AuditResult): LhrAuditDetails => {
    if (audit.details?.type === "opportunity") {
        return audit.details
        // {
        //     type: "opportunity",
        //     overallSavingsMs: audit.details?.overallSavingsMs || null,
        // }
    } else {
        return {
            type: audit.details?.type || null,
        }
    }
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

        // Skip metrics, they are already added
        if (auditRef.group === "metrics" || auditRef.group === "hidden") continue;

        // Find audit in list
        const auditIndex = audits.findIndex(audit => audit.id === auditRef.id);
        const audit = audits[auditIndex];

        if (audit === undefined) continue;

        // If audit is passed, it shouldn't be shown in the opportunity list
        if (audit.passed) {
            passedRefs.push(audit.id);
        } else {
            // If audit is not passed, add to opportunity audits
            if (opportunityRefs.includes(auditRef.id) === false && audit?.details.type === "opportunity") {
                opportunityRefs.push(auditRef.id);
            }
        }
    };

    // Add diagnostic refs
    for (const auditRef of performance.auditRefs) {

        // Diagnostic audits are the ones left, that have not been included elsewhere
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

