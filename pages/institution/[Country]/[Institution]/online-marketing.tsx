import { City, Country, Institution } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import { ParsedUrlQuery } from 'querystring'
import React from 'react'
import Breadcrumb from '../../../../components/layout/Breadcrumb'
import { FooterContent } from '../../../../components/layout/footer/Footer'
import LayoutContainer from '../../../../components/layout/LayoutContainer'
import Meta from '../../../../components/partials/Meta'
import prisma from '../../../../lib/prisma'
import { getCountries, getCountry, getInstitution, getInstitutionPaths } from '../../../../lib/prismaQueries'
import InstitutionNav from '../../../../components/layout/subnav/InstitutionNav'

type Props = {

  institution: Institution,
  country: Country,
  footerContent: FooterContent[],

}

const InstitutionOnlineMarketing: NextPage<Props> = props => {

  return (
    <LayoutContainer footerContent={props.footerContent}>

      <Meta
        title={'Uni Index - '}
        description='Very nice page'
      />

      <Breadcrumb countryInfo={props.country} institutionInfo={props.institution} />

      <InstitutionNav title={props.institution.name} />

    </LayoutContainer>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {

  let countryUrl = "" + context?.params?.Country;
  let institutionUrl = "" + context?.params?.Institution;
  let localeDb = "" + context.locale;

  const country = await getCountry(countryUrl);
  const institution = await getInstitution(institutionUrl);

  // Footer Data
  // Get all countries
  const countryList = await getCountries("asc");
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: { institution: institution, country: country, footerContent: footerContent }
  }

}

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


export default InstitutionOnlineMarketing