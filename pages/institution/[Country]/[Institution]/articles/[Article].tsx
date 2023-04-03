import { Stack, Text, Title, Divider } from '@mantine/core';
import { country, institution } from '@prisma/client';
import { GetServerSideProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import ResponsiveWrapper from '../../../../../components/Container/ResponsiveWrapper';
import Breadcrumb from '../../../../../features/Breadcrumb/Breadcrumb';
import { TipTapParser } from '../../../../../lib/parser/tiptapParser';
import { getAdPostByUrl } from '../../../../../lib/prisma/prismaNews';
import { getCountry, getInstitution } from '../../../../../lib/prisma/prismaQueries';
import { ArticleData } from '../../../../../lib/types/ArticleTypes';


type Props = {
    country: country | null;
    institution: institution;
    articleData: ArticleData;
}

const InstitutionArticle = ({ country, institution, articleData }: Props) => {

    const { t, lang } = useTranslation("institution");

    // const output = useMemo(() => {
    //     return parseTiptapContent(articleData.content)
    // }, [articleData]);

    const parser = new TipTapParser();
    const rendered = parser.renderJson(articleData.content);

    return (
        <ResponsiveWrapper>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('meta.screenshots-title', { institution: institution?.name })}</title>
                <meta key={"description"} name="description" content={t('meta.screenshots-description')} />
            </Head>

            <Breadcrumb countryInfo={country} institutionInfo={institution} />

            <Stack>
                <Title order={1}>{articleData.title.en}</Title>
                <Text>{articleData.excerpt}</Text>
                <Divider />

                {rendered}
                {/* <TypographyStylesProvider>
                    <div dangerouslySetInnerHTML={{ __html: output }} />
                </TypographyStylesProvider> */}

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
    const articleData = await getAdPostByUrl(encodeURIComponent(articleUrl), institutionUrl, lang);

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