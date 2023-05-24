import { Title, Text, Stack } from '@mantine/core';
import { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import ResponsiveWrapper from '../../../components/Container/ResponsiveWrapper';
import Breadcrumb from '../../../features/Breadcrumb/Breadcrumb';
import { getCountries } from '../../../lib/prisma/prismaQueries';
import SmTotalBar from '../../../features/Charts/SmTotalBar';
import { getSocialMediaRanking } from '../../../lib/prisma/prismaSocialMedia';

export interface SmStatisticGraphRatings {
    total: number[]
    twitter: number[]
    youtube: number[]
}

interface Props {
    ratingDistribution: number[]
    ratingDistributionTwitter: number[]
    ratingDistributionYoutube: number[]
}

const Statistics: NextPage<Props> = ({ ratingDistribution, ratingDistributionTwitter, ratingDistributionYoutube }: Props) => {

    // const socialMedia = JSON.parse(socialMediaStringified);
    const { t } = useTranslation('analysis');

    return (
        <ResponsiveWrapper>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('meta.seo-sm-statistics-title')}</title>
                <meta key={"description"} name="description" content={t('meta.seo-sm-statistics-description')} />
            </Head>

            <Breadcrumb />

            <Stack spacing={'lg'}>

                <div>
                    <Title order={1}>Global Stats</Title>
                    <Text>We have gathered an extensive collection of statistics to provide you with valuable insights into how universities are leveraging social media platforms to connect with students, alumni, and the wider community.</Text>
                </div>

                <div>
                    <Title order={2}>Score distribution</Title>
                    <Text mb={'xs'}>The graph showcases the scores of various social media pages belonging to universities in Europe. This graph is designed to provide a clear and concise visualization of the social media landscape of universities. It empowers users to make informed decisions, identify trends, and gather insights into their social media performance in Europe.</Text>
                    <SmTotalBar ratings={{
                        total: ratingDistribution,
                        twitter: ratingDistributionTwitter,
                        youtube: ratingDistributionYoutube,
                    }} />
                </div>
            </Stack>



        </ResponsiveWrapper>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {

    const countries = await getCountries();

    const rawSocialMediaList = await getSocialMediaRanking({});

    const emptyArr = () => [...new Array(10)].map(() => 0);

    const addToRating = (ratingArray: number[], score: number) => {
        if (score < 1) ratingArray[0]++;
        else if (score <= 2) ratingArray[1]++;
        else if (score <= 3) ratingArray[2]++;
        else if (score <= 4) ratingArray[3]++;
        else if (score <= 5) ratingArray[4]++;
        else if (score <= 6) ratingArray[5]++;
        else if (score <= 7) ratingArray[6]++;
        else if (score <= 8) ratingArray[7]++;
        else if (score <= 9) ratingArray[8]++;
        else if (score <= 10) ratingArray[9]++;
    }

    const ratingDistribution = emptyArr();
    const ratingDistributionTwitter = emptyArr();
    const ratingDistributionYoutube = emptyArr();
    rawSocialMediaList.forEach((item) => {
        addToRating(ratingDistribution, item.total_score);
        addToRating(ratingDistributionTwitter, item.twitter_score);
        addToRating(ratingDistributionYoutube, item.youtube_score);
    });

    const props: Props = {
        ratingDistribution,
        ratingDistributionTwitter,
        ratingDistributionYoutube,
    }

    return { props };
}

export default Statistics;