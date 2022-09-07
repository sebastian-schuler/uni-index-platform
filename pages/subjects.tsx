import { Masonry } from '@mui/lab';
import { Grid, Stack, Typography } from '@mui/material';
import { GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import SubjectTypeCard from '../components/elements/itemcards/SubjectTypeCard';
import Breadcrumb from '../components/layout/Breadcrumb';
import { FooterContent } from '../components/layout/footer/Footer';
import LayoutContainer from '../components/layout/LayoutContainer';
import Meta from '../components/partials/Meta';
import { getDetailedSubjectTypes } from '../lib/prismaDetailedQueries';
import { getCountries } from '../lib/prismaQueries';
import { DetailedSubjectType } from '../lib/types/DetailedDatabaseTypes';

type Props = {
    detailedSubjectTypes: DetailedSubjectType[]
    footerContent: FooterContent[]
}

const subjects: NextPage<Props> = props => {

    const { detailedSubjectTypes, footerContent } = props;

    const { t, lang } = useTranslation('subject');
    const langContent = {
        pageTitle: t('common:page-title'),
        title: t('subjects-title'),
        subtitle: t('subjects-title-sub')
    }

    return (
        <LayoutContainer footerContent={footerContent}>

            <Meta
                title={langContent.pageTitle + ' - ' + langContent.title}
                description='Very nice page'
            />

            <Breadcrumb />

            <Stack sx={{ marginBottom: 1 }}>
                <Typography
                    variant="h6"
                    component="h2"
                >
                    {langContent.title}
                </Typography>
                <Typography
                    variant="subtitle1"
                    component="span"
                >
                    {langContent.subtitle}
                </Typography>
            </Stack>

            <Grid container columnSpacing={4}>

                <Grid item xs={12} sm={4} xl={2}>

                    ffffffffffffffffffffffffffff

                    {/* <SearchBox
                    label={langContent.searchLabel}
                    placeholder={langContent.searchPlaceholder}
                    searchableList={dataList}
                    setSearchableList={setDataList}
                /> */}

                </Grid>

                <Grid item
                    xs={12} sm={8} xl={10}
                    flexGrow={1}
                    component={'section'}
                >


                    <Masonry columns={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 3 }} spacing={3} sx={{ paddingX: 0, marginBottom: 6 }}>
                        {
                            detailedSubjectTypes.map((subjectType, i) => (
                                <SubjectTypeCard key={i} subjectType={subjectType} />
                            ))
                        }
                    </Masonry>

                </Grid>

            </Grid>

        </LayoutContainer>
    )

}

export async function getStaticProps(context: GetStaticPropsContext) {

    // List of subject categories
    const detailedSubjectTypes = await getDetailedSubjectTypes();

    // Footer Data
    const countryList = await getCountries("asc");
    const footerContent: FooterContent[] = [
        { title: "Countries", data: countryList, type: "Country" },
    ]

    return {
        props: { detailedSubjectTypes, footerContent }
    }

}

export default subjects