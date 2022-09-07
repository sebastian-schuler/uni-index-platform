import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import LargeAd from '../elements/premiumads/LargeAd'
import MediumAd from '../elements/premiumads/MediumAd'
import SmallAd from '../elements/premiumads/SmallAd'
import { DetailedPremiumAd } from '../../lib/types/DetailedDatabaseTypes'
import { Box, Divider, Grid, SimpleGrid, Skeleton, Stack, Title, useMantineTheme } from '@mantine/core'
import ResponsiveContainer from '../layout/ResponsiveContainer'

const PRIMARY_COL_HEIGHT = 300;

interface Props {
    premiumAds: DetailedPremiumAd[]
}

const PremiumList: React.FC<Props> = ({ premiumAds }: Props) => {

    const { t } = useTranslation('common');
    const langContent = {
        adLabel: t('ad-label'),
    }

    const theme = useMantineTheme();
    const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;

    const ads = premiumAds.sort((a, b) => { return b.size - a.size });

    // const renderAd = (ad: DetailedPremiumAd, i: number) => {

    //     let url = "#";
    //     let name = "";
    //     let subtext = "";

    //     if (ad.type === "subject") {
    //         url = ad.Subject?.url || "";
    //         name = ad.Subject?.name || "";
    //         subtext = ad.User.Institution.name;
    //     } else if (ad.type === "institution") {
    //         url = ad.User.Institution.url;
    //         name = ad.User.Institution.name;
    //         subtext = ad.User.Institution.InstitutionLocation.length > 0 ? ad.User.Institution.InstitutionLocation[0].City.name : "";
    //     }

    //     if (ad.size === 1) {
    //         return <SmallAd key={i} url={'/locations'} title={name} headline={name} subtext={subtext} />

    //     } else if (ad.size === 2) {
    //         return <MediumAd key={i} url={'/locations'} title={name} headline={name} subtext={subtext} imgUrl={"/images/thumbnails/countries" + "/germany" + ".jpg"} />

    //     } else if (ad.size === 3) {
    //         return <LargeAd key={i} url={'/locations'} title={name} headline={name} subtext={subtext} imgUrl={"/images/thumbnails/countries" + "/germany" + ".jpg"} description={ad.description || ""} />

    //     } else {
    //         return <></>
    //     }
    // }


    return (

        <Box>
            <ResponsiveContainer paddingY>

                {/* <Stack sx={{ marginBottom: 2 }} spacing={0}> */}
                {/* <Box sx={{alignContent: "start"}}> */}
                <Title order={3}>{langContent.adLabel}</Title>
                <Divider mt={4} mb={24} />
                {/* </Box> */}
                {/* </Stack> */}

                {/* <Masonry columns={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 4 }} spacing={3} sx={{ paddingX: 0 }}>
                {
                    ads.map((ad, i) => (
                        renderAd(ad, i)
                    ))
                }
            </Masonry> */}

                <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                    <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={false} />
                    <Grid gutter="md">
                        <Grid.Col>
                            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
                        </Grid.Col>
                    </Grid>
                </SimpleGrid>

            </ResponsiveContainer>
        </Box>
    )
}

export default PremiumList