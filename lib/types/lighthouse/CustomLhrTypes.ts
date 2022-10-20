import { ScoreDisplayModes } from "./audit-result"

export interface MinifiedLhrReport {
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
    displayValue: string | null
    type: string | null
    passed: boolean
}