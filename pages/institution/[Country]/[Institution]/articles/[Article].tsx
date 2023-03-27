import { Stack, Text, Title } from '@mantine/core';
import { Country, Institution } from '@prisma/client';
import { GetServerSideProps, GetStaticPaths } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import GenericPageHeader from '../../../../../components/Block/GenericPageHeader';
import ResponsiveWrapper from '../../../../../components/Container/ResponsiveWrapper';
import Breadcrumb from '../../../../../features/Breadcrumb/Breadcrumb';
import InstitutionNav from '../../../../../features/Navigation/InstitutionNav';
import { getAdPostByUrl } from '../../../../../lib/prisma/prismaNews';
import { getCountry, getInstitution } from '../../../../../lib/prisma/prismaQueries';
import { ArticleCardData } from '../../../../../lib/types/UiHelperTypes';

type Props = {
    country: Country | null;
    institution: Institution;
    articleData: ArticleCardData;
}

const InstitutionArticle = ({ country, institution, articleData }: Props) => {

    const { t, lang } = useTranslation("institution");

    return (
        <ResponsiveWrapper>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('meta.screenshots-title', { institution: institution?.name })}</title>
                <meta key={"description"} name="description" content={t('meta.screenshots-description')} />
            </Head>

            <Breadcrumb countryInfo={country} institutionInfo={institution} />

            <Stack>
                <Title order={1}>{articleData.title}</Title>
                <Text>{articleData.excerpt}</Text>
            </Stack>

        </ResponsiveWrapper>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const lang = context.locale || "en";
    const institutionUrl = context?.params?.Institution ? context?.params?.Institution as string : null;
    const articleUrl = context?.params?.Article ? context?.params?.Article as string : null;
    const countryUrl = context?.params?.Country ? context?.params?.Country as string : null;

    if (!institutionUrl || !articleUrl || !countryUrl) {
        return { notFound: true }
    }
    const country = await getCountry(countryUrl);
    const institution = await getInstitution({ institutionUrl });
    const articleData = await getAdPostByUrl(articleUrl, institutionUrl, lang);

    if (!articleData || !institution || !country) {
        return { notFound: true }
    }

    const props: Props = {
        country,
        institution,
        articleData
    }
    return { props };
}

export default InstitutionArticle