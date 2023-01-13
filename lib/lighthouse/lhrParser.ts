import markdownToHtml from "../markdownParser";
import { AuditResult } from "../types/lighthouse/audit-result";
import { LhrAudit, LhrAuditDetails, LhrCategory, LhrCategoryName, LhrMinified } from "../types/lighthouse/CustomLhrTypes";
import Result from "../types/lighthouse/lhr";

export const getMinifiedLhrCategory = async (lhrData: any, category?: LhrCategoryName) => {

    let lhrResult: LhrMinified = {
        audits: [],
        categories: [],
    }
    if (lhrData === null || lhrData === undefined) return lhrResult;

    const lhr = lhrData as Result;

    // AUDITS
    const audits: LhrAudit[] = [];
    for (const id of Object.keys(lhr.audits)) {

        const audit: AuditResult = lhr.audits[id]

        if (audit !== undefined && audit.scoreDisplayMode !== "manual" && (audit.scoreDisplayMode !== "notApplicable" || audit.details !== undefined)) {

            const passed =
                (audit.score === null || audit.score >= 0.9) &&
                (audit.scoreDisplayMode !== "informative" ||
                    (audit.scoreDisplayMode === "informative" && audit.details?.type === "table" && audit.details.headings.length === 0)
                );

            const parsedDescription = await markdownToHtml(audit.description || "");

            audits.push({
                id: audit.id,
                title: audit.title,
                scoreDisplayMode: audit.scoreDisplayMode,
                description: parsedDescription,
                score: audit.score,
                displayValue: audit.displayValue || null,
                passed: passed,
                details: getDetailsObject(audit),
            });
        }
        // });
    }
    lhrResult.audits = audits;

    // CATEGORIES
    if (category === undefined) {
        // Add all categories

        const performance = getPerformanceCategory(lhr, audits);
        lhrResult.categories.push(performance);

        const seo = getSEOCategory(lhr, audits);
        lhrResult.categories.push(seo);

        const bestPractices = getBestPracticesCategory(lhr, audits);
        lhrResult.categories.push(bestPractices);

        const accessibility = getAccessibilityCategory(lhr, audits);
        lhrResult.categories.push(accessibility);

    } else {
        // Add specific category
        switch (category) {

            case "performance":
                const performance = getPerformanceCategory(lhr, audits);
                lhrResult.categories.push(performance);
                lhrResult.audits = filterUnnecessaryAudits(lhrResult.audits, performance);
                break;

            case "seo":
                const seo = getSEOCategory(lhr, audits);
                lhrResult.categories.push(seo);
                lhrResult.audits = filterUnnecessaryAudits(lhrResult.audits, seo);
                break;

            case "best-practices":
                const bestPractices = getBestPracticesCategory(lhr, audits);
                lhrResult.categories.push(bestPractices);
                lhrResult.audits = filterUnnecessaryAudits(lhrResult.audits, bestPractices);
                break;

            case "accessibility":
                const accessibility = getAccessibilityCategory(lhr, audits);
                lhrResult.categories.push(accessibility);
                lhrResult.audits = filterUnnecessaryAudits(lhrResult.audits, accessibility);
                break;

        }
    }

    return lhrResult;
}

const getDetailsObject = (audit: AuditResult): LhrAuditDetails => {

    if (audit.details?.type === "opportunity") {
        return audit.details;

    } else if (audit.details?.type === "table") {
        return audit.details;

    } else {
        return {
            type: audit.details?.type || null,
        }
    }
}

const filterUnnecessaryAudits = (audits: LhrAudit[], category: LhrCategory) => {
    return audits.filter(audit => {
        return (
            category.metricRefs.some(metricRef => metricRef === audit.id) ||
            category.opportunityRefs.some(opportunityRef => opportunityRef === audit.id) ||
            category.diagnosticRefs.some(diagnosticRef => diagnosticRef === audit.id) ||
            category.passedRefs.some(passedRef => passedRef === audit.id)
        )
    })
}

// ==================== CATEGORY PARSERS ====================

const getMetricRefs = (resultCategory: Result.Category): string[] => {
    const metricRefs: string[] = [];
    resultCategory.auditRefs.filter((auditRef) => auditRef.weight > 0).forEach((auditRef) => {
        metricRefs.push(auditRef.id);
    });
    return metricRefs;
}

const getDiagnosticRefs = (resultCategory: Result.Category, opportunityRefs: string[], metricRefs: string[], passedRefs: string[]): string[] => {
    const diagnosticRefs: string[] = [];
    for (const auditRef of resultCategory.auditRefs) {

        // Diagnostic audits are the ones left, that have not been included elsewhere
        if (opportunityRefs.includes(auditRef.id) || metricRefs.includes(auditRef.id) || passedRefs.includes(auditRef.id)) continue;

        if (auditRef.group !== "hidden") diagnosticRefs.push(auditRef.id);
    }
    return diagnosticRefs;
}

const getOpportunityAndPassedRefs = (resultCategory: Result.Category, audits: LhrAudit[], category: LhrCategoryName) => {

    const opportunityRefs: string[] = [];
    const passedRefs: string[] = [];

    // Add opportunity refs and passed refs
    for (const auditRef of resultCategory.auditRefs) {

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
            if (opportunityRefs.includes(auditRef.id) === false) {

                switch (category) {

                    case "seo":
                        if (auditRef.group === "seo-crawl")
                            opportunityRefs.push(auditRef.id);
                        break;

                    case "performance":
                        if (audit?.details.type === "opportunity")
                            opportunityRefs.push(auditRef.id);

                    default:
                        opportunityRefs.push(auditRef.id);
                        break;
                }
            }
        }
    };

    return {
        opportunityRefs,
        passedRefs,
    }
}

const getPerformanceCategory = (lhr: Result, audits: LhrAudit[]): LhrCategory => {

    const performance = lhr.categories["performance"];

    const metricRefs: string[] = getMetricRefs(performance);
    const { opportunityRefs, passedRefs } = getOpportunityAndPassedRefs(performance, audits, "performance");
    const diagnosticRefs: string[] = getDiagnosticRefs(performance, opportunityRefs, metricRefs, passedRefs);

    return {
        id: performance.id,
        title: performance.title,
        score: performance.score || 0,
        metricRefs,
        opportunityRefs,
        diagnosticRefs,
        passedRefs,
    }
}

const getSEOCategory = (lhr: Result, audits: LhrAudit[]): LhrCategory => {
    const seo = lhr.categories["seo"];

    const metricRefs: string[] = getMetricRefs(seo);
    const { opportunityRefs, passedRefs } = getOpportunityAndPassedRefs(seo, audits, "seo");
    const diagnosticRefs: string[] = getDiagnosticRefs(seo, opportunityRefs, metricRefs, passedRefs);

    return {
        id: seo.id,
        title: seo.title,
        score: seo.score || 0,
        metricRefs,
        opportunityRefs,
        diagnosticRefs,
        passedRefs,
    }
}

const getBestPracticesCategory = (lhr: Result, audits: LhrAudit[]): LhrCategory => {
    const seo = lhr.categories["best-practices"];

    const metricRefs: string[] = getMetricRefs(seo);
    const { opportunityRefs, passedRefs } = getOpportunityAndPassedRefs(seo, audits, "best-practices");
    const diagnosticRefs: string[] = getDiagnosticRefs(seo, opportunityRefs, metricRefs, passedRefs);

    return {
        id: seo.id,
        title: seo.title,
        score: seo.score || 0,
        metricRefs,
        opportunityRefs,
        diagnosticRefs,
        passedRefs,
    }
}

const getAccessibilityCategory = (lhr: Result, audits: LhrAudit[]): LhrCategory => {
    const seo = lhr.categories["accessibility"];

    const metricRefs: string[] = getMetricRefs(seo);
    const { opportunityRefs, passedRefs } = getOpportunityAndPassedRefs(seo, audits, "accessibility");
    const diagnosticRefs: string[] = getDiagnosticRefs(seo, opportunityRefs, metricRefs, passedRefs);

    return {
        id: seo.id,
        title: seo.title,
        score: seo.score || 0,
        metricRefs,
        opportunityRefs,
        diagnosticRefs,
        passedRefs,
    }
}

