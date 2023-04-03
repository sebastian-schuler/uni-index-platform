import { Box, px, Text, useMantineTheme } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import AdCardLarge from '../../components/Card/AdCardLarge'
import AdCardMedium from '../../components/Card/AdCardMedium'
import AdCardSmall from '../../components/Card/AdCardSmall'
import { CreateAdLinkedItemType } from './CreateAdBuilder'

const PRIMARY_AD_HEIGHT = 400;

type AdPreviewProps = {
    title: string
    adSize: number
    description: string
    adLinkedItemType: CreateAdLinkedItemType
    imageFilepath: string | undefined
}

const AdPreview = ({ title, adSize, description, adLinkedItemType, imageFilepath }: AdPreviewProps) => {

    const { t } = useTranslation('account');
    const theme = useMantineTheme();
    const SECONDARY_AD_HEIGHT = PRIMARY_AD_HEIGHT / 2 - px(theme.spacing.lg) / 2;

    /**
     * Gets the headline of the ad
     * @returns 
     */
    const getAdHeadline = (): string => {
        if (title === "") {
            return t('create-ad.ad.preview.title-placeholder');
        }
        return title;
    }

    return (
        <div>
            <Text size={"xl"} color={"dimmed"} weight={"bold"}>{t('create-ad.ad.preview.title')}</Text>

            {
                adSize === 3 &&
                <AdCardLarge
                    description={description === "" ? t('create-ad.ad.preview.description-placeholder') : description}
                    subtext='subtext'
                    title={getAdHeadline()}
                    link='#'
                    colHeight={PRIMARY_AD_HEIGHT}
                    adType={adLinkedItemType}
                    imgUrl={imageFilepath}
                    disableLink
                />
                ||
                adSize === 2 &&
                <AdCardMedium
                    subtext='subtext'
                    description={description === "" ? t('create-ad.ad.preview.description-placeholder') : description}
                    title={getAdHeadline()}
                    link='#'
                    colHeight={SECONDARY_AD_HEIGHT}
                    adType={adLinkedItemType}
                    imgUrl={imageFilepath}
                    disableLink
                />
                ||
                adSize === 1 &&
                <Box sx={{ maxWidth: 260 }}>
                    <AdCardSmall
                        subtext='subtext'
                        description={description === "" ? t('create-ad.ad.preview.description-placeholder') : description}
                        title={getAdHeadline()}
                        link='#'
                        adType={adLinkedItemType}
                        colHeight={SECONDARY_AD_HEIGHT}
                        disableLink
                    />
                </Box>
            }

        </div>
    )
}

export default AdPreview