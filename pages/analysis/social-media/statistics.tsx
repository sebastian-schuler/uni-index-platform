import { Title } from '@mantine/core';
import { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import ResponsiveWrapper from '../../../components/Container/ResponsiveWrapper';
import Breadcrumb from '../../../features/Breadcrumb/Breadcrumb';
import { getCountries } from '../../../lib/prisma/prismaQueries';

export interface SmStatisticGraphRatings {
    total: number[]
    twitter: number[]
    youtube: number[]
}

interface Props {
    graphRatings: SmStatisticGraphRatings
}

const Statistics: NextPage<Props> = ({ graphRatings }: Props) => {

    // const socialMedia = JSON.parse(socialMediaStringified);
    const { t } = useTranslation('analysis');

    return (
        <ResponsiveWrapper>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('meta.seo-sm-statistics-title')}</title>
                <meta key={"description"} name="description" content={t('meta.seo-sm-statistics-description')} />
            </Head>

            <Breadcrumb />

            <Title mb={"md"}>Gesamtstatistiken</Title>

            {/* <SmTotalBar ratings={graphRatings} /> */}

        </ResponsiveWrapper>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {

    const countries = await getCountries();

    // SOCIAL MEDIA
    // const socialMediaList = await getAllSocialMedia();
    // const socialMediaStringified = JSON.stringify(socialMediaList);

    // Graph Country comparison data
    // const graphDataGermany = socialMediaList.filter((item: SocialMediaDBEntry) => item.institution.city.state.country.name === "Germany");

    const emptyArr = () => [...new Array(10)].map(() => 0);

    // const graphRatings: SmStatisticGraphRatings = {
    //     total: emptyArr(),
    //     twitter: emptyArr(),
    //     youtube: emptyArr(),
    // }

    // const addToRating = (ratingArray: number[], score: number) => {
    //     if (score < 10) ratingArray[0]++;
    //     else if (score <= 20) ratingArray[1]++;
    //     else if (score <= 30) ratingArray[2]++;
    //     else if (score <= 40) ratingArray[3]++;
    //     else if (score <= 50) ratingArray[4]++;
    //     else if (score <= 60) ratingArray[5]++;
    //     else if (score <= 70) ratingArray[6]++;
    //     else if (score <= 80) ratingArray[7]++;
    //     else if (score <= 90) ratingArray[8]++;
    //     else if (score <= 100) ratingArray[9]++;
    // }

    // graphDataGermany.forEach((item: SocialMediaDBEntry) => {
    //     const parsedScore = JSON.parse(item.total_score) as TotalScore;
    //     addToRating(graphRatings.total, parsedScore.percent.all.total);
    //     addToRating(graphRatings.twitter, parsedScore.percent.twitter.total);
    //     addToRating(graphRatings.youtube, parsedScore.percent.youtube.total);
    // });

    return {
        props: {
            countries,
            // graphRatings,
        }
    }

}

export default Statistics;