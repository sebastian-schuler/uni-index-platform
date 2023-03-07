import { Box, Divider, Grid, px, SimpleGrid, Text, Title, useMantineTheme } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { DetailedUserAd } from '../../lib/types/DetailedDatabaseTypes'
import { URL_INSTITUTION } from '../../lib/url-helper/urlConstants'
import { toLink } from '../../lib/util/util'
import MantineLink from '../../components/Link/MantineLink'
import AdCardLarge from '../../components/Card/AdCardLarge'
import AdCardMedium from '../../components/Card/AdCardMedium'
import AdCardSmall from '../../components/Card/AdCardSmall'
import ResponsiveContainer from '../../components/Container/ResponsiveContainer'
import Trans from 'next-translate/Trans'

export const LARGE_AD_HEIGHT = 400;

interface Props {
    premiumAds: DetailedUserAd[]
    wrapInContainer?: boolean
}

const PremiumList: React.FC<Props> = ({ premiumAds, wrapInContainer }: Props) => {

    const { t } = useTranslation('common');

    const theme = useMantineTheme();

    const AD_SPACING = theme.spacing.lg;
    const MEDIUM_AD_HEIGHT = LARGE_AD_HEIGHT / 2 - px(AD_SPACING) / 2;

    const largeAds = premiumAds.filter((ad) => { return ad.size === 3 });
    const mediumAds = premiumAds.filter((ad) => { return ad.size === 2 });
    const smallAds = premiumAds.filter((ad) => { return ad.size === 1 });
    // largeAds.push(largeAds[0])

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
            return <AdCardSmall
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
            return <AdCardMedium
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
            return <AdCardLarge
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
                    <div>
                        {
                            largeAds.map((ad, i) => (
                                renderAd(ad, i, LARGE_AD_HEIGHT)
                            ))
                        }
                    </div>
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
                    </Grid>
                </SimpleGrid>

            </ResponsiveContainer>
        </Box>
    )
}

export default PremiumList