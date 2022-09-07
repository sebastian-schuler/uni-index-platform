import { Country, Institution } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React from 'react'
import Breadcrumb from '../../../../components/layout/Breadcrumb';
import LayoutContainer from '../../../../components/layout/LayoutContainer'
import Meta from '../../../../components/partials/Meta';
import prisma from '../../../../lib/prisma'
import { getCountries, getCountry, getInstitution, getInstitutionPaths } from '../../../../lib/prismaQueries';
import { getDBLocale } from '../../../../lib/util';
import searchWikipedia from '../../../../lib/apis/wikipediaHandler';
import InstitutionNav from '../../../../components/layout/subnav/InstitutionNav';
import { FooterContent } from '../../../../components/layout/footer/Footer';
import { Typography } from '@mui/material';

type Props = {

  institution: Institution,
  country: Country,
  wikipediaContent: string,

  footerContent: {
    title: string;
    data: Country[];
  }[],

}

const InstitutionPage: NextPage<Props> = props => {

  const { t, lang } = useTranslation('common');
  const langContent = {
    pageTitle: t('common:page-title'),
  }
  const query = useRouter().query;

  return (
    <LayoutContainer>

      <Meta
        title={langContent.pageTitle + " - "}
        description='Very nice page'
      />

      <Breadcrumb countryInfo={props.country} institutionInfo={props.institution} />

      <InstitutionNav title={props.institution.name} />

      <Typography variant='h5'>About</Typography>
      <Typography variant='body1'>{props.wikipediaContent}</Typography>
      <Typography variant='caption'>Source: Wikipedia</Typography>

    </LayoutContainer>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {

  let countryUrl = "" + context?.params?.Country;
  let institutionUrl = "" + context?.params?.Institution;
  let localeDb = getDBLocale(context.locale);

  // Get Wikipedia Data
  const wikiDataRes = await searchWikipedia("Hochschule Kaiserslautern", "" + context.locale)

  const country = await getCountry(countryUrl);
  const institution = await getInstitution(institutionUrl);

  // Footer Data
  // Get all countries
  const countryList = await getCountries("asc");
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: { institution: institution, country: country, wikipediaContent: wikiDataRes, footerContent: footerContent }
  }

}

// All available Paths
export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

  const institutions = await getInstitutionPaths();

  let paths: {
    params: ParsedUrlQuery;
    locale?: string | undefined;
  }[] = [];

  // Add locale to every possible path
  locales?.forEach((locale) => {
    institutions.forEach((institution) => {

      // Iterate every Institution but also every InstitutionLocation (unis can have multiple locations, even in different countries)
      institution.Subject.forEach((subject) => {
        paths.push({
          params: {
            Country: subject.City?.State.Country.url,
            Institution: institution.url
          },
          locale,
        });
      })

    })
  });

  return {
    paths: paths,
    fallback: false
  }
}


export default InstitutionPage