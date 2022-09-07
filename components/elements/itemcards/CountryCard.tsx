import { Badge, Card, createStyles, Image, Text } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { PATH_COUNTRY_IMAGES, URL_INSTITUTION, URL_LOCATION } from '../../../data/urlConstants'
import { DetailedCountry } from '../../../lib/types/DetailedDatabaseTypes'
import { getLocalizedName, toLink } from '../../../lib/util'

const useStyles = createStyles((theme) => ({
    card: {
        position: 'relative',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    rating: {
        position: 'absolute',
        top: theme.spacing.xs,
        right: theme.spacing.xs + 2,
        pointerEvents: 'none',
    },

    title: {
        display: 'block',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xs / 2,
    },

    action: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        ...theme.fn.hover({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        }),
    },

    footer: {
        marginTop: theme.spacing.md,
    },
}));

type Props = {
    country: DetailedCountry
    linkType: "location" | "institution";
}

const CountryCard: React.FC<Props> = ({ country, linkType }: Props) => {

    const { classes, cx, theme } = useStyles();

    const { t } = useTranslation('common');
    const langContent = {
        universityLabel: t('card-label-universities', { count: country.institutionCount }),
        courseLabel: t('card-label-courses', { count: country.subjectCount })
    }

    const name = getLocalizedName({ lang: 'en', dbTranslated: country });

    const link = linkType === 'location' ? toLink(URL_LOCATION, country.url) : toLink(URL_INSTITUTION, country.url);

    return (
        // <Card>
        //     <CardActionArea component={Link} href={link} title={name}>
        //         <CardMedia sx={{ height: 140 }}>
        //             <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        //                 <Image
        //                     src={toLink(PATH_COUNTRY_IMAGES, country.url + ".jpg")}
        //                     layout="fill"
        //                     objectFit="cover"
        //                 />
        //             </div>
        //         </CardMedia>
        //         <CardContent>
        //             <Typography variant="subtitle1" component="h3" color="primary.main">
        //                 {name}
        //             </Typography>

        //             <Stack direction={"row"} justifyContent={"space-between"} color="text.primary" sx={{ opacity: 0.7, marginTop: 2 }}>
        //                 <Typography variant="body2" >
        //                     {langContent.universityLabel}
        //                 </Typography>
        //                 <Typography variant="body2" >
        //                     {langContent.courseLabel}
        //                 </Typography>
        //             </Stack>

        //         </CardContent>
        //     </CardActionArea>
        // </Card>

        <Link href={link} passHref>
            <Card component='a' withBorder radius="md" className={classes.card}>

                <Card.Section>
                    <Image src={toLink(PATH_COUNTRY_IMAGES, country.url + ".jpg")} fit="cover" height={130} />
                </Card.Section>

                <Text className={classes.title} weight={500}>
                    {name}
                </Text>

                <Text size="md" color="dimmed" lineClamp={4}>
                    {langContent.universityLabel}
                </Text>

                <Text size="md" color="dimmed" lineClamp={4}>
                    {langContent.courseLabel}
                </Text>

            </Card>
        </Link>
    )
}

export default CountryCard