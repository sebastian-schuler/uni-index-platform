import { ScoreDisplayModes } from "./audit-result"

export interface MinifiedLhrReport {
    performance: LhrCategory | null
    accessibility: LhrCategory | null
    bestPractices: LhrCategory | null
    seo: LhrCategory | null
    pwa: LhrCategory | null
}

export interface LhrCategory {
    title: string
    audits: LhrAudit[]
    score: number
}

export interface LhrAudit {
    id: string
    score: number | null
    scoreDisplayMode: string
    title: string
    displayValue: string | null
}