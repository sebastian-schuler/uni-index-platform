import { Anchor, Box, Card, createStyles, Group, Image, Text } from '@mantine/core'
import dayjs from 'dayjs'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { ArticleCardData } from '../../lib/types/UiHelperTypes'
import CardTitle from '../Text/CardTitle'
import Flags from 'country-flag-icons/react/3x2'
import { toLink } from '../../lib/util/util'
import { URL_INSTITUTION, URL_INSTITUTION_ARTICLES } from '../../lib/url-helper/urlConstants'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
        height: "100%",
    },

    section: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        lineHeight: 1.8,
    },

    institutionLink: {
        lineHeight: .3,
    },

    flag: {
        width: "2rem",
        opacity: 0.75,
    }

}));

interface Props {
    data: ArticleCardData
}

const ArticleCard: React.FC<Props> = ({ data }: Props) => {

    const { classes, theme } = useStyles();
    const { t } = useTranslation('common');
    
    const url = toLink(URL_INSTITUTION, data.country.url, data.institution.url, URL_INSTITUTION_ARTICLES, data.url);
    const urlInstitution = toLink(URL_INSTITUTION, data.country.url, data.institution.url, URL_INSTITUTION_ARTICLES);

    const code = data.country.countryCode || "EU";
    let Flag: any = undefined;
    if (Object.keys(Flags).includes(code)) {
      // @ts-ignore
      Flag = Flags[code] || Flags["EU"];
    }

    return (
        <Card withBorder radius="md" shadow={"sm"} className={classes.card}>

            <Card.Section>
                <Image src={data.imageUrl} fit="cover" height={200} alt={""} />
            </Card.Section>

            <Card.Section className={classes.section}>
                <Group position='apart'>
                    <CardTitle href={url} text={data.title} />
                    <Flag className={classes.flag} />
                </Group>
                <Text>{dayjs(data.date).format('DD/MM/YYYY')}</Text>
                <Anchor component={Link} href={urlInstitution} className={classes.institutionLink}>
                    <Text lh={1.5}>{data.institution.name}</Text>
                </Anchor>
            </Card.Section>

            <Group noWrap>
                <Text>{data.excerpt}</Text>
            </Group>

        </Card>
    )
}

export default ArticleCard