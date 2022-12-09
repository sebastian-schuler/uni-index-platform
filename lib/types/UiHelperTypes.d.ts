import { CountryCardData, DetailedSubjectType } from "./DetailedDatabaseTypes"

export type Searchable = {
    type: "Country"
    visible: boolean,
    data: CountryCardData
} | {
    type: "SubjectType"
    visible: boolean,
    data: DetailedSubjectType
}