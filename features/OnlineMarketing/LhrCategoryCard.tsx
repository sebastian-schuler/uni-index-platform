import { Card, createStyles, RingProgress, Stack, Text } from '@mantine/core';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import MantineLink from '../../components/Link/MantineLink';

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    label: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontSize: 22,
        fontWeight: 700,
        lineHeight: 1,
    },

    lead: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 700,
        fontSize: 22,
        lineHeight: 1,
    },

    inner: {
        display: 'flex',

        [theme.fn.smallerThan(350)]: {
            flexDirection: 'column',
        },
    },

    ring: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',

        [theme.fn.smallerThan(350)]: {
            justifyContent: 'center',
            marginTop: theme.spacing.md,
        },
    },
}));

type Props = {
    title: string
    score: number
    description: string
    url: string
}

const LhrCategoryCard: React.FC<Props> = ({ title, score, description, url }: Props) => {

    const { classes, theme } = useStyles();
    const total = 100;
    const { t } = useTranslation('institution');

    return (
        <Card withBorder p="md" radius="md" className={classes.card}>
            <div className={classes.inner}>
                <Stack>
                    <Text size="xl" className={classes.label}>
                        {title}
                    </Text>
                    <Text>{description}</Text>
                    <MantineLink type='internal' url={url}>{t('online-marketing.label-show-details', { category: title })}</MantineLink>
                </Stack>

                <div className={classes.ring}>
                    <RingProgress
                        thickness={14}
                        size={150}
                        sections={[
                            { value: (score / total) * 100, color: theme.primaryColor },
                            { value: 100 - ((score / total) * 100), color: theme.colors.gray[6] },
                        ]}
                        label={
                            <div>
                                <Text align="center" size="lg" className={classes.label} sx={{ fontSize: 22 }}>
                                    {((score / total) * 100).toFixed(0)}%
                                </Text>
                                <Text align="center" size="sm" color="dimmed">{t('online-marketing.label-score')}</Text>
                            </div>
                        }
                    />
                </div>
            </div>
        </Card>
    );
}

export default LhrCategoryCard