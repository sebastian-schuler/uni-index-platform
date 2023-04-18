import { Stack, Text, Title, Divider, Image, useMantineTheme, Box, Anchor } from '@mantine/core';
import { country, institution } from '@prisma/client';
import { GetServerSideProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import ResponsiveWrapper from '../../../../../components/Container/ResponsiveWrapper';
import Breadcrumb from '../../../../../features/Breadcrumb/Breadcrumb';
import { TipTapParser } from '../../../../../lib/parser/tiptapParser';
import { getAdPostByUrl } from '../../../../../lib/prisma/prismaArticles';
import { getCountry, getInstitution } from '../../../../../lib/prisma/prismaQueries';
import { ArticleData } from '../../../../../lib/types/ArticleTypes';
import { toLink } from '../../../../../lib/util/util';
import { URL_INSTITUTION } from '../../../../../lib/url-helper/urlConstants';
import Trans from 'next-translate/Trans';
import Link from 'next/link';


type Props = {
    country: country | null;
    institution: institution;
    articleData: ArticleData;
}

const InstitutionArticle = ({ country, institution, articleData }: Props) => {

    const { t, lang } = useTranslation("institution");
    const theme = useMantineTheme();

    const parser = new TipTapParser();
    const rendered = parser.renderJson(articleData.content);
    const date = new Date(articleData.date).toLocaleDateString(lang);

    const institutionUrl = toLink(URL_INSTITUTION, articleData.country.url, articleData.institution.url);
    const title = articleData.title.en;

    return (
        <ResponsiveWrapper>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('meta.article-title', { institution: institution?.name, title: title })}</title>
                <meta key={"description"} name="description" content={t('meta.article-description', { institution: institution?.name, title: title })} />
            </Head>

            <Stack>
                <Breadcrumb countryInfo={country} institutionInfo={institution} />
                <Box sx={{ maxWidth: theme.breakpoints.xs }}>
                    <Image src={`/api/image/${articleData.image.id}?ext=${articleData.image.filetype}`} fit="cover" height={200} alt={""} radius={'md'} />
                </Box>
                <div>
                    <Title order={1}>{articleData.title.en}</Title>
                    <Text>
                        <Trans
                            i18nKey='institution:article.subtext'
                            components={[<Anchor key={'institution-link'} component={Link} href={institutionUrl} />]}
                            values={{ date: date, author: articleData.institution.name }}
                        />
                    </Text>
                    <Text>{articleData.excerpt}</Text>
                </div>
                <Divider />

                {rendered}

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