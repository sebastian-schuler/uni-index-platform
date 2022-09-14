import { Box, Divider, Grid, SimpleGrid, Text, Title, useMantineTheme } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { DetailedUserAd } from '../../lib/types/DetailedDatabaseTypes'
import { URL_INSTITUTION } from '../../lib/url-helper/urlConstants'
import { toLink } from '../../lib/util'
import MantineLink from '../elements/MantineLink'
import LargeAd from '../elements/userads/LargeAd'
import MediumAd from '../elements/userads/MediumAd'
import SmallAd from '../elements/userads/SmallAd'
import ResponsiveContainer from '../layout/ResponsiveContainer'

export const LARGE_AD_HEIGHT = 400;


interface Props {
    premiumAds: DetailedUserAd[]
    wrapInContainer?: boolean
}

const PremiumList: React.FC<Props> = ({ premiumAds, wrapInContainer }: Props) => {

    const { t } = useTranslation('common');
    const langContent = {
        adLabel: t('ad-label'),
    }

    const theme = useMantineTheme();

    const AD_SPACING = theme.spacing.lg;
    const MEDIUM_AD_HEIGHT = LARGE_AD_HEIGHT / 2 - AD_SPACING / 2;

    const largeAds = premiumAds.filter((ad) => { return ad.size === 3 });
    const mediumAds = premiumAds.filter((ad) => { return ad.size === 2 });
    const smallAds = premiumAds.filter((ad) => { return ad.size === 1 });

    const renderAd = (ad: DetailedUserAd, i: number, colHeight: number) => {

        let url = "#";
        let name = "";
        let subtext = "";

        if (ad.type === "subject") {
            url = toLink(URL_INSTITUTION, ad.User.Institution.City.State.Country.url, ad.User.Institution.url, ad.Subject?.url || "");
            name = ad.Subject?.name || "";
            subtext = ad.User.Institution.name;
        } else if (ad.type === "institution") {
            url = toLink(URL_INSTITUTION, ad.User.Institution.City.State.Country.url, ad.User.Institution.url || "");
            name = ad.User.Institution.name;
            subtext = ad.User.Institution.InstitutionLocation.length > 0 ? ad.User.Institution.InstitutionLocation[0].City.name : "";
        }

        if (ad.size === 1) {
            return <SmallAd
                key={ad.id + "/" + i}
                link={url}
                title={name}
                headline={name}
                subtext={subtext}
                adType={ad.type}
                description={ad.description || ""}
                colHeight={colHeight}
            />

        } else if (ad.size === 2) {
            return <MediumAd
                key={ad.id + "/" + i}
                link={url}
                title={name}
                headline={name}
                subtext={subtext}
                adType={ad.type}
                description={ad.description || ""}
                colHeight={colHeight}
                imgUrl={"/images/thumbnails/countries" + "/germany" + ".jpg"}
            />

        } else if (ad.size === 3) {
            return <LargeAd
                key={ad.id + "/" + i}
                link={url}
                title={name}
                headline={name}
                subtext={subtext}
                imgUrl={"/images/thumbnails/countries" + "/germany" + ".jpg"}
                adType={ad.type}
                colHeight={colHeight}
                description={ad.description || ""}
            />

        } else {
            return <></>
        }
    }

    return (

        <Box>
            <ResponsiveContainer skipContainer={!wrapInContainer}>

                <Title order={3} size={theme.fontSizes.lg}>{langContent.adLabel}</Title>
                <Text>Click <MantineLink url='#' label='here' /> to learn more about our ads.</Text>
                <Divider mt={4} mb={24} />

                <SimpleGrid cols={2} spacing={AD_SPACING} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                    {/* <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={false} /> */}
                    {
                        largeAds.map((ad, i) => (
                            renderAd(ad, i, LARGE_AD_HEIGHT)
                        ))
                    }
                    <Grid gutter={AD_SPACING}>
                        {
                            mediumAds.map((ad, i) => (
                                <Grid.Col key={i}>
                                    {renderAd(ad, i, MEDIUM_AD_HEIGHT)}
                                </Grid.Col>
                            ))
                        }
                        {
                            smallAds.map((ad, i) => (
                                <Grid.Col key={i} span={6}>
                                    {renderAd(ad, i, MEDIUM_AD_HEIGHT)}
                                </Grid.Col>
                            ))
                        }
                        {/* <Grid.Col>
                            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={true} />
                        </Grid.Col> */}
                        {/* <Grid.Col span={6}>
                            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
                        </Grid.Col> */}
                    </Grid>
                </SimpleGrid>

            </ResponsiveContainer>
        </Box>
    )
}

export default PremiumList