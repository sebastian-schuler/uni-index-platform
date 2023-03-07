import { GetServerSideProps, NextPage } from 'next'
import SearchResultList from '../features/GlobalSearch/SearchResultList'
import Breadcrumb from '../features/Breadcrumb/Breadcrumb'
import ResponsiveWrapper from '../components/Container/ResponsiveWrapper'
import { getGlobalSearchResults } from '../lib/prisma/prismaGlobalSearch'
import { LinkableCity, LinkableInstitution, LinkableSubject } from '../lib/types/Linkables'

interface Props {

}

const Search: NextPage<Props> = ({ }: Props) => {

    return (
        <ResponsiveWrapper>

            <Breadcrumb />

            Search Page


                {/* <SearchResultList header='Subjects' resSubject={subjects} />
                <SearchResultList header='Institutions' resInstitution={institutions} />
                <SearchResultList header='Cities' resCities={cities} /> */}

        </ResponsiveWrapper>
    )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {

//     const { q } = context.query;
//     const res = await getGlobalSearchResults(q as string);

//     return {
//         props: {
//             subjects: res.subjects,
//             institutions: res.institutions,
//             cities: res.cities,
//         }
//     }
// }

export default Search
