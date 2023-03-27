import { Title, SimpleGrid, Stack } from '@mantine/core'
import { Country, Institution } from '@prisma/client'
import { GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import React from 'react'
import ArticleCard from '../../../../../components/Card/ArticleCard'
import ResponsiveWrapper from '../../../../../components/Container/ResponsiveWrapper'
import Breadcrumb from '../../../../../features/Breadcrumb/Breadcrumb'
import InstitutionNav from '../../../../../features/Navigation/InstitutionNav'
import { getAllAdPosts } from '../../../../../lib/prisma/prismaNews'
import { getCountry, getInstitution } from '../../../../../lib/prisma/prismaQueries'
import { ArticleCardData } from '../../../../../lib/types/UiHelperTypes'

type Props = {
  country: Country;
  institution: Institution;
  articles: ArticleCardData[];
}

const InstitutionArticlesPage = ({ country, institution, articles }: Props) => {

  const { t } = useTranslation("institution");

  return (
    <ResponsiveWrapper>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('meta.screenshots-title', { institution: institution?.name })}</title>
        <meta key={"description"} name="description" content={t('meta.screenshots-description')} />
      </Head>

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution.name} />

      <Stack>
        <Title order={2}>Articles</Title>

        <SimpleGrid
          spacing="lg"
          breakpoints={[
            { minWidth: 'md', cols: 3, spacing: 'md' },
            { minWidth: 'sm', cols: 2, spacing: 'sm' },
          ]}
        >
          {
            articles.map((item) => {

              return (
                <ArticleCard
                  key={item.id}
                  data={item}
                />
              )
            })
          }
        </SimpleGrid>
      </Stack>

    </ResponsiveWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const lang = context.locale || "en";
  let countryUrl = context?.params?.Country ? context?.params?.Country as string : null;
  let institutionUrl = context?.params?.Institution ? context?.params?.Institution as string : null;

  if (!countryUrl || !institutionUrl) return { notFound: true };

  const country = await getCountry(countryUrl);
  const institution = await getInstitution({ institutionUrl });

  if (!country || !institution) return { notFound: true };

  const articles = await getAllAdPosts(lang, institution.id);

  const props: Props = {
    country,
    institution,
    articles
  }
  return { props };
}

export default InstitutionArticlesPage