import { country, institution } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import Breadcrumb from '../../../../features/Breadcrumb/Breadcrumb'
import { FooterContent } from '../../../../features/Footer/Footer'
import ResponsiveWrapper from '../../../../components/Container/ResponsiveWrapper'
import InstitutionNav from '../../../../features/Navigation/InstitutionNav'
import { getCountries, getCountry, getInstitution } from '../../../../lib/prisma/prismaQueries'
import { getStaticPathsInstitution } from '../../../../lib/url-helper/staticPathFunctions'

interface Props {
  institution: institution,
  country: country,
  footerContent: FooterContent[],
}

const InstitutionReviews: NextPage<Props> = ({ institution, country, footerContent }: Props) => {

  const { t, lang } = useTranslation('institution');

  return (
    <ResponsiveWrapper footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('meta.reviews-title', { institution: institution?.name })}</title>
        <meta key={"description"} name="description" content={t('meta.reviews-description')} />
      </Head>

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution.name} />

    </ResponsiveWrapper>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {

  let countryUrl = "" + context?.params?.Country;
  let institutionUrl = "" + context?.params?.Institution;

  const country = await getCountry(countryUrl);
  const institution = await getInstitution({ institutionUrl });

  if (!country || !institution) {
    return {
      notFound: true,
    }
  }

  // Footer Data
  // Get all countries
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  const props: Props = {
    institution, country, footerContent
  }

  return { props };
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

  const paths = await getStaticPathsInstitution(locales || []);

  return {
    paths: paths,
    fallback: false
  }
}


export default InstitutionReviews