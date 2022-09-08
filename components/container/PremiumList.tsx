import { Box, Divider, Grid, SimpleGrid, Title, useMantineTheme } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { DetailedPremiumAd } from '../../lib/types/DetailedDatabaseTypes'
import LargeAd from '../elements/premiumads/LargeAd'
import MediumAd from '../elements/premiumads/MediumAd'
import SmallAd from '../elements/premiumads/SmallAd'
import ResponsiveContainer from '../layout/ResponsiveContainer'

const PRIMARY_COL_HEIGHT = 400;

interface Props {
    premiumAds: DetailedPremiumAd[]
    wrapInContainer?: boolean
}

const PremiumList: React.FC<Props> = ({ premiumAds, wrapInContainer }: Props) => {

    const { t } = useTranslation('common');
    const langContent = {
        adLabel: t('ad-label'),
    }

    const theme = useMantineTheme();
    const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;

    const largeAds = premiumAds.filter((ad) => { return ad.size === 3 });
    const mediumAds = premiumAds.filter((ad) => { return ad.size === 2 });
    const smallAds = premiumAds.filter((ad) => { return ad.size === 1 });

    const renderAd = (ad: DetailedPremiumAd, i: number, colHeight: number) => {

        let url = "#";
        let name = "";
        let subtext = "";

        if (ad.type === "subject") {
            url = ad.Subject?.url || "";
            name = ad.Subject?.name || "";
            subtext = ad.User.Institution.name;
        } else if (ad.type === "institution") {
            url = ad.User.Institution.url;
            name = ad.User.Institution.name;
            subtext = ad.User.Institution.InstitutionLocation.length > 0 ? ad.User.Institution.InstitutionLocation[0].City.name : "";
        }

        if (ad.size === 1) {
            return <SmallAd
                key={ad.id + "/" + i}
                link={'/locations'}
                title={name}
                headline={name}
                subtext={subtext}
                colHeight={colHeight}
            />

        } else if (ad.size === 2) {
            return <MediumAd
                key={ad.id + "/" + i}
                link={'/locations'}
                title={name}
                headline={name}
                subtext={subtext}
                colHeight={colHeight}
                imgUrl={"/images/thumbnails/countries" + "/germany" + ".jpg"}
            />

        } else if (ad.size === 3) {
            return <LargeAd
                key={ad.id + "/" + i}
                link={'/locations'} title={name}
                headline={name} subtext={subtext}
                imgUrl={"/images/thumbnails/countries" + "/germany" + ".jpg"}
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

                <Title order={3}>{langContent.adLabel}</Title>
                <Divider mt={4} mb={24} />

                <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                    {/* <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={false} /> */}
                    {
                        largeAds.map((ad, i) => (
                            renderAd(ad, i, PRIMARY_COL_HEIGHT)
                        ))
                    }
                    <Grid gutter="md">
                        {
                            mediumAds.map((ad, i) => (
                                <Grid.Col key={i}>
                                    {renderAd(ad, i, SECONDARY_COL_HEIGHT)}
                                </Grid.Col>
                            ))
                        }
                        {
                            smallAds.map((ad, i) => (
                                <Grid.Col key={i} span={6}>
                                    {renderAd(ad, i, SECONDARY_COL_HEIGHT)}
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