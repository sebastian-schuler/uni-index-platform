import { Grid, Stack, Typography } from '@mui/material'
import { Country } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import InstitutionCard from '../../../components/elements/itemcards/InstitutionCard'
import Breadcrumb from '../../../components/layout/Breadcrumb'
import { FooterContent } from '../../../components/layout/footer/Footer'
import LayoutContainer from '../../../components/layout/LayoutContainer'
import Meta from '../../../components/partials/Meta'
import prisma from '../../../lib/prisma'
import { getCountries, getCountry, getInstitutesDetailed } from '../../../lib/prismaQueries'
import { DetailedInstitution } from '../../../lib/types/DetailedDatabaseTypes'
import { getDBLocale, getLocalizedName } from '../../../lib/util'

type Props = {
  institutions: DetailedInstitution[],
  countryInfo: Country,
  footerContent: FooterContent[],
}

const index: NextPage<Props> = props => {

  const { institutions, countryInfo, footerContent } = props

  const { t, lang } = useTranslation('common');
  const query = useRouter().query;

  const localizedCountryName = getLocalizedName({ lang: lang, dbTranslated: props.countryInfo });

  return (
    <LayoutContainer footerContent={props.footerContent}>

      <Meta
        title={'Uni Index - ' + localizedCountryName}
        description='Very nice page'
      />

      <Breadcrumb countryInfo={props.countryInfo} />

      <Stack sx={{ marginBottom: 2 }}>
        <Typography
          variant="h6"
          component="h2"
        >
          {countryInfo.name}
        </Typography>
        <Typography
          variant="subtitle1"
          component="span"
        >
          Find universities located in {countryInfo.name}
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
              institutions.map((institution, i) => (

                <Grid item key={i} xs={12} sm={6} xl={4}>
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

  const countries = await prisma.country.findMany();

  let paths: {
    params: ParsedUrlQuery;
    locale?: string | undefined;
  }[] = [];

  // Add locale to every possible path
  locales?.forEach((locale) => {
    countries.forEach((country) => {
      paths.push({
        params: {
          Country: country.url,
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

  let countryUrl = "" + context?.params?.Country;
  let localeDb = getDBLocale(context.locale);

  const countryInfo = await getCountry(countryUrl);
  const institutions: DetailedInstitution[] = await getInstitutesDetailed({countryUrl: countryUrl});

  // Footer Data
  // Get all countries
  const countryList = await getCountries("asc");
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: { institutions: institutions, countryInfo: countryInfo, footerContent: footerContent }
  }

}



export default index