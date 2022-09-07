import { Grid, Stack, Typography } from '@mui/material';
import { City, Country, State } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import InstitutionCard from '../../../../../components/elements/itemcards/InstitutionCard';
import Breadcrumb from '../../../../../components/layout/Breadcrumb';
import { FooterContent } from '../../../../../components/layout/footer/Footer';
import LayoutContainer from '../../../../../components/layout/LayoutContainer';
import Meta from '../../../../../components/partials/Meta';
import { getCityStateCountryByCity, getCityStateCountryPaths, getCountries, getInstitutesDetailed } from '../../../../../lib/prismaQueries';
import { DetailedInstitution } from '../../../../../lib/types/DetailedDatabaseTypes';

type Props = {
  institutionList: DetailedInstitution[],
  footerContent: FooterContent[],
  cityInfo: (City & {
    State: State & {
      Country: Country;
    };
  }),
}

const CityPage: NextPage<Props> = props => {

  const { institutionList, footerContent, cityInfo } = props;

  const query = useRouter().query;
  const { t } = useTranslation('common');
  const langContent = {
    pageTitle: t('common:page-title')
  }

  return (
    <LayoutContainer footerContent={footerContent}>

      <Meta
        title={langContent.pageTitle + ' - ' + cityInfo.name}
        description='Very nice page'
      />

      <Breadcrumb
        countryInfo={cityInfo.State.Country}
        stateInfo={cityInfo.State}
        cityInfo={cityInfo}
      />

      <Stack sx={{ marginBottom: 2 }}>
        <Typography
          variant="h6"
          component="h2"
        >
          {cityInfo.name}
        </Typography>
        <Typography
          variant="subtitle1"
          component="span"
        >
          Find courses located in the city of {cityInfo.name}
        </Typography>
      </Stack>

      <Grid container columnSpacing={4}>

        <Grid item xs={12} sm={3} xl={2}>

          ffffffffffffffffffffffffffff

          {/* <SearchBox
                    label={langContent.searchLabel}
                    placeholder={langContent.searchPlaceholder}
                    searchableList={dataList}
                    setSearchableList={setDataList}
                    /> */}

        </Grid>

        <Grid item
                    xs={12} sm={9} xl={10}
                    flexGrow={1}
                    component={'section'}
                >
                    <Grid container spacing={4}>
                        {
                            institutionList.map((institution, i) => (

                                <Grid item key={i} xs={12} sm={4} xl={4}>
                                  <InstitutionCard institution={institution} />
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>

      </Grid>

    </LayoutContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

  const pathUrls = await getCityStateCountryPaths();

  let paths: {
    params: ParsedUrlQuery;
    locale?: string | undefined;
  }[] = [];

  // Add locale to every possible path
  locales?.forEach((locale) => {
    pathUrls.forEach((rootCity) => {
      paths.push({
        params: {
          Country: rootCity.State.Country.url,
          State: rootCity.State.url,
          City: rootCity.url,
        },
        locale,
      });
    })
  });

  return {
    paths: paths,
    fallback: false
  }
}

export async function getStaticProps(context: GetStaticPropsContext) {

  let cityUrl = "" + context?.params?.City;

  const institutes = await getInstitutesDetailed({cityUrl: cityUrl});
  const cityInfo = await getCityStateCountryByCity(cityUrl);

  // Footer Data
  // Get all countries
  const countryList = await getCountries("asc");
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: { institutionList: institutes, footerContent: footerContent, cityInfo: cityInfo }
  }

}

export default CityPage