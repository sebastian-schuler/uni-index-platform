import { GetServerSideProps, NextPage } from 'next'
import SearchResultList from '../components/elements/search/SearchResultList'
import Breadcrumb from '../components/layout/Breadcrumb'
import LayoutContainer from '../components/layout/LayoutContainer'
import { getGlobalSearchResults } from '../lib/prisma/prismaGlobalSearch'
import { LinkableCity, LinkableInstitution, LinkableSubject } from '../lib/types/Linkables'

interface Props {
    subjects: LinkableSubject[]
    institutions: LinkableInstitution[],
    cities: LinkableCity[],
}

const Search: NextPage<Props> = ({ subjects, institutions, cities }: Props) => {

    return (
        <LayoutContainer>

            <Breadcrumb />

            <div className='flex flex-col gap-4'>

                <SearchResultList header='Subjects' resSubject={subjects} />
                <SearchResultList header='Institutions' resInstitution={institutions} />
                <SearchResultList header='Cities' resCities={cities} />

            </div>

        </LayoutContainer>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const { q } = context.query;
    const res = await getGlobalSearchResults(q as string);

    return {
        props: {
            subjects: res.subjects,
            institutions: res.institutions,
            cities: res.cities,
        }
    }
}

export default Search
