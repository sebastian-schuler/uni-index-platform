import { Box, Divider, Grid, px, SimpleGrid, Text, Title, useMantineTheme } from '@mantine/core'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import AdCardLarge from '../../components/Card/AdCardLarge'
import AdCardMedium from '../../components/Card/AdCardMedium'
import AdCardSmall from '../../components/Card/AdCardSmall'
import ResponsiveContainer from '../../components/Container/ResponsiveContainer'
import MantineLink from '../../components/Link/MantineLink'
import { AdCardData } from '../../lib/types/UiHelperTypes'

export const LARGE_AD_HEIGHT = 400;

/**
 * Render an ad
 * @param ad - ad data
 * @param colHeight - height of the column
 * @returns - JSX.Element
 */
const renderAd = (ad: AdCardData, colHeight: number) => {

    if (ad.sizeCost === 1) {
        return <AdCardSmall
            key={ad.id}
            link={ad.fullUrl}
            title={ad.title}
            subtext={ad.subtext}
            adType={ad.type}
            description={ad.description || ""}
            colHeight={colHeight}
        />

    } else if (ad.sizeCost === 2) {
        return <AdCardMedium
            key={ad.id}
            link={ad.fullUrl}
            title={ad.title}
            subtext={ad.subtext}
            adType={ad.type}
            description={ad.description || ""}
            colHeight={colHeight}
            imageId={ad.imageId}
            imageExtension={ad.imageExtension}
        />

    } else if (ad.sizeCost === 4) {
        return <AdCardLarge
            key={ad.id}
            link={ad.fullUrl}
            title={ad.title}
            subtext={ad.subtext}
            adType={ad.type}
            colHeight={colHeight}
            description={ad.description || ""}
            imageId={ad.imageId}
            imageExtension={ad.imageExtension}
        />

    } else {
        return undefined;
    }
}

interface Props {
    ads: AdCardData[][]
    wrapInContainer?: boolean
}

const AdContainer: React.FC<Props> = ({ ads, wrapInContainer }: Props) => {

    const { t } = useTranslation('common');
    const theme = useMantineTheme();

    const AD_SPACING = theme.spacing.lg;
    const MEDIUM_AD_HEIGHT = LARGE_AD_HEIGHT / 2 - px(AD_SPACING) / 2;

    /**
     * Renders a column of ads
     * @param ads - ads sorted by sizeCost
     */
    const renderAdCol = (ads: AdCardData[], key: string) => {
        if (ads.length === 0) return undefined;

        // A large ad is rendered alone in a column
        if (ads.at(0)?.sizeCost === 4) {
            return (
                <div key={key}>
                    {
                        ads.map((ad) => renderAd(ad, LARGE_AD_HEIGHT))
                    }
                </div>
            );
        } else {
            // Medium and small ads are rendered in a grid
            const mediumAds = ads.filter((ad) => { return ad.sizeCost === 2 });
            const smallAds = ads.filter((ad) => { return ad.sizeCost === 1 });
            return (
                <Grid key={key} gutter={AD_SPACING}>
                    {
                        mediumAds.map((ad) => (
                            <Grid.Col key={"col" + ad.id}>
                                {renderAd(ad, MEDIUM_AD_HEIGHT)}
                            </Grid.Col>
                        ))
                    }
                    {
                        smallAds.map((ad) => (
                            <Grid.Col key={"col" + ad.id} span={6}>
                                {renderAd(ad, MEDIUM_AD_HEIGHT)}
                            </Grid.Col>
                        ))
                    }
                </Grid>
            )
        }
    }

    /**
     * Renders a list of ads
     */
    const adLists = ads.map((adList, i) => {

        let leftSize = 0;
        let rightSize = 0;
        const left: AdCardData[] = [];
        const right: AdCardData[] = [];

        // Make sure both columns have a size of 4
        for (let y = 0; y < adList.length; y++) {
            const ad = adList[y];
            if (leftSize < 4) {
                left.push(ad);
                leftSize += ad.sizeCost;
            } else if (rightSize < 4) {
                right.push(ad);
                rightSize += ad.sizeCost;
            }
        }

        return (
            <React.Fragment key={i}>
                {renderAdCol(left, "left" + i)}
                {renderAdCol(right, "right" + i)}
            </React.Fragment>
        )
    });

    return (

        <Box>
            <ResponsiveContainer skipContainer={!wrapInContainer} paddingY>

                <Title order={3} size={theme.fontSizes.lg}>{t('ads.title')}</Title>
                <Text>
                    <Trans
                        i18nKey="common:ads.desc"
                        components={[
                            <MantineLink key={"linkAdInfos"} url='#' type='internal' />
                        ]}
                    />
                </Text>

                <Divider mt={4} mb={24} />

                <SimpleGrid cols={2} spacing={AD_SPACING} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                    {adLists}
                </SimpleGrid>

            </ResponsiveContainer>
        </Box>
    )
}

export default AdContainer