import React from 'react'
import { URL_INSTITUTION, URL_LOCATION, URL_SUBJECT } from '../../../data/urlConstants'
import { LinkableCity, LinkableInstitution, LinkableSubject } from '../../../lib/types/Linkables'
import { toLink } from '../../../lib/util'
import InternalLink from '../InternalLink'

type Props = {
    header: string
    resCities?: LinkableCity[]
    resSubject?: LinkableSubject[]
    resInstitution?: LinkableInstitution[]
}

// TODO turn it into MUI component
const SearchResultList: React.FC<Props> = props => {

    let outputList = <></>;

    // Cities
    if (props.resCities !== undefined) {

        if (props.resCities.length === 0) return <></>;

        outputList = <> {
            props.resCities.map((item, i) => (
                <div key={i}>
                    <InternalLink title='' href={toLink(URL_LOCATION, item.State.Country.url, item.State.url, item.url)}>{item.name}</InternalLink>
                </div>
            ))
        }</>;

        // Subjects
    } else if (props.resSubject !== undefined) {

        if (props.resSubject.length === 0) return <></>;

        outputList = <> {
            props.resSubject.map((item, i) => (
                <div key={i}>
                    <InternalLink title='' href={toLink(URL_SUBJECT, item.SubjectType.url, item.url)}>{item.name}</InternalLink>
                </div>
            ))
        }</>;

        // Institutions
    } else if (props.resInstitution !== undefined) {

        const filteredList = props.resInstitution.filter(value => value.InstitutionLocation.length === 0 ? false : true);
        if (filteredList.length === 0) return <></>;

        outputList = <> {
            filteredList.map((item, i) => (
                <div key={i}>
                    <InternalLink title='' href={toLink(URL_INSTITUTION, item.InstitutionLocation[0].City.State.Country.url, item.url)}>{item.name}</InternalLink>
                </div>
            ))
        }</>;
    }

    return (
        <div>
            <h2 className='font-semibold'>{props.header}</h2>
            <div className='flex flex-col'>
                {outputList}
            </div>
        </div>
    )
}

export default SearchResultList