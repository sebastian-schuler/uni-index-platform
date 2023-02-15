import { Country, Institution } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import Breadcrumb from '../../../../layout/Breadcrumb'
import { FooterContent } from '../../../../layout/footer/Footer'
import LayoutContainer from '../../../../layout/LayoutContainer'
import InstitutionNav from '../../../../layout/subnav/InstitutionNav'
import { getCountries, getCountry, getInstitution } from '../../../../lib/prisma/prismaQueries'
import { getStaticPathsInstitution } from '../../../../lib/url-helper/staticPathFunctions'

interface Props {
  institution: Institution,
  country: Country,
  footerContent: FooterContent[],
}

const InstitutionReviews: NextPage<Props> = ({ institution, country, footerContent }: Props) => {

  const { t, lang } = useTranslation('institution');

  return (
    <LayoutContainer footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('institution-reviews-title', { institution: institution?.name })}</title>
        <meta key={"description"} name="description" content={t('institution-reviews-description')} />
      </Head>

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution.name} />

    </LayoutContainer>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {

  let countryUrl = "" + context?.params?.Country;
  let institutionUrl = "" + context?.params?.Institution;

  const country = await getCountry(countryUrl);
  const institution = await getInstitution({ institutionUrl });

  // Footer Data
  // Get all countries
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: { institution: institution, country: country, footerContent: footerContent }
  }

}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

  const paths = await getStaticPathsInstitution(locales || []);

  return {
    paths: paths,
    fallback: false
  }
}


export default InstitutionReviews