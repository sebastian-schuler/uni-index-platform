import { Card, CardSection, createStyles, SimpleGrid, Text } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link'
import React from 'react'
import { LhrSimple } from '../../../lib/types/lighthouse/CustomLhrTypes';
import LhrRingProgress from './LhrRingProgress';

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
        transition: "all .2s ease-in-out",
        height: "100%",

        '&:hover': {
            transform: "scale(1.03)",
        }
    },

    section: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },

}));

interface Props {
    report: LhrSimple,
}

const OnlineMarketingCard = ({ report }: Props) => {

    const { classes, theme } = useStyles();
    const { t } = useTranslation('common');

    return (
        <Link href={report.institution.slug} passHref>
            <Card component='a' withBorder radius="md" p="md" shadow={"sm"} className={classes.card}>

                <CardSection className={classes.section}>
                    <Text size={"xl"} weight={'bold'}>{report.institution.name}</Text>
                    <Text>{report.institution.website}</Text>
                </CardSection>

                <SimpleGrid cols={2}>

                    <LhrRingProgress
                        size='sm'
                        title={t('online-marketing-category.performance')}
                        score={report.performanceScore * 100}
                    />

                    <LhrRingProgress
                        size='sm'
                        title={t('online-marketing-category.best-practices')}
                        score={report.bestPracticesScore * 100}
                    />

                    <LhrRingProgress
                        size='sm'
                        title={t('online-marketing-category.accessibility')}
                        score={report.accessibilityScore * 100}
                    />

                    <LhrRingProgress
                        size='sm'
                        title={t('online-marketing-category.seo')}
                        score={report.seoScore * 100}
                    />

                </SimpleGrid>



            </Card>
        </Link>
    )
}

export default OnlineMarketingCard