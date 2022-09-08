import { DetailedCountry, DetailedSubjectType } from "./DetailedDatabaseTypes"

export type Searchable = {
    type: "Country"
    visible: boolean,
    data: DetailedCountry
} | {
    type: "SubjectType"
    visible: boolean,
    data: DetailedSubjectType
}