import { ScoreDisplayModes } from "./audit-result"
import { FormattedIcu } from "./i18n";
import AuditDetails from "./audit-details";
import { Institution } from "@prisma/client";

export interface LhrMinified {
    audits: LhrAudit[]
    categories: LhrCategory[]
}

export interface LhrCategory {
    id: string
    title: string
    metricRefs: string[]
    opportunityRefs: string[]
    diagnosticRefs: string[]
    passedRefs: string[]
    score: number | null
}

export interface LhrAudit {
    id: string
    score: number | null
    scoreDisplayMode: string
    title: string
    description: string
    displayValue: string | null
    // type: string | null
    passed: boolean
    details: LhrAuditDetails
}

export type LhrAuditDetails = {
    type: 'criticalrequestchain'
} | {
    type: 'filmstrip'
} | {
    type: 'list'
} |
    AuditDetails.Opportunity |
    AuditDetails.Table |
{
    type: "debugdata" | "treemap-data" | "screenshot" | "full-page-screenshot" | null
}

export type LhrSimple = {
    institution: LhrInstitution
    total: number
    performanceScore: number
    accessibilityScore: number
    bestPracticesScore: number
    seoScore: number
    pwaScore: number
}

export type LhrInstitution = {
    id: string
    name: string
    slug: string
    website: string
}

export type LhrCategoryName = "performance" | "accessibility" | "best-practices" | "seo" | "pwa";