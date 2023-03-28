import { Card, CardSection, createStyles, SimpleGrid, Stack } from '@mantine/core';
import useTranslation from 'next-translate/useTranslation';
import LhrRingProgress from '../../features/OnlineMarketing/LhrRingProgress';
import { LhrSimple } from '../../lib/types/lighthouse/CustomLhrTypes';
import { URL_INSTITUTION_OM_ACCESSIBILITY, URL_INSTITUTION_OM_BESTPRACTICES, URL_INSTITUTION_OM_PERFORMANCE, URL_INSTITUTION_OM_SEO } from '../../lib/url-helper/urlConstants';
import { toLink } from '../../lib/util/util';
import MantineLink from '../Link/MantineLink';
import CardTitle from '../Text/CardTitle';

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
        height: "100%",
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
    const { t } = useTranslation('index');

    return (
        <Card withBorder radius="md" p="md" shadow={"sm"} className={classes.card}>

            <CardSection className={classes.section}>
                <Stack spacing={theme.spacing.sm}>
                    <CardTitle href={report.institution.slug} text={report.institution.name} />
                    <MantineLink type='external' url={report.institution.website} props={{ lh: 1 }}>{report.institution.website}</MantineLink>
                </Stack>
            </CardSection>

            <SimpleGrid cols={2}>

                <LhrRingProgress
                    size='sm'
                    title={
                        <MantineLink type='internal' url={toLink(report.institution.slug, URL_INSTITUTION_OM_PERFORMANCE)}>
                            {t('online-marketing.categories.performance')}
                        </MantineLink>
                    }
                    score={report.performanceScore * 100}
                />

                <LhrRingProgress
                    size='sm'
                    title={
                        <MantineLink type='internal' url={toLink(report.institution.slug, URL_INSTITUTION_OM_BESTPRACTICES)}>
                            {t('online-marketing.categories.best-practices')}
                        </MantineLink>
                    }
                    score={report.bestPracticesScore * 100}
                />

                <LhrRingProgress
                    size='sm'
                    title={
                        <MantineLink type='internal' url={toLink(report.institution.slug, URL_INSTITUTION_OM_ACCESSIBILITY)}>
                            {t('online-marketing.categories.accessibility')}
                        </MantineLink>
                    }
                    score={report.accessibilityScore * 100}
                />

                <LhrRingProgress
                    size='sm'
                    title={
                        <MantineLink type='internal' url={toLink(report.institution.slug, URL_INSTITUTION_OM_SEO)}>
                            {t('online-marketing.categories.seo')}
                        </MantineLink>
                    }
                    score={report.seoScore * 100}
                />

            </SimpleGrid>



        </Card>
    )
}

export default OnlineMarketingCard