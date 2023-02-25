import React from 'react';
import { createStyles, Group, Text, ThemeIcon } from '@mantine/core';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import useTranslation from 'next-translate/useTranslation';

const useStyles = createStyles((theme) => ({
    label: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
}));

interface Props {
    title: string;
    institutionValue: number
    countryValue: number
}

const SmStatRow: React.FC<Props> = ({ title, institutionValue, countryValue }: Props) => {

    const { lang } = useTranslation('common');
    const { classes } = useStyles();

    const negative = institutionValue < countryValue;
    const diff = (institutionValue / countryValue) * 100;

    const DiffIcon = negative ? IconArrowDownRight : IconArrowUpRight;

    const valueString = institutionValue < 1 ?
        institutionValue.toLocaleString(lang, { maximumFractionDigits: 5, minimumFractionDigits: 5 }) :
        institutionValue.toLocaleString(lang, { maximumFractionDigits: 0, minimumFractionDigits: 0 });

    return (
        <div>
            <Group position="apart">
                <div>
                    <Text
                        color="dimmed"
                        transform="uppercase"
                        weight={700}
                        size="xs"
                        className={classes.label}
                    >
                        {title}
                    </Text>
                    <Text weight={700} size="xl" sx={{ lineHeight: 1.2 }}>
                        {valueString}
                    </Text>
                </div>
                <ThemeIcon
                    color="gray"
                    variant="light"
                    sx={(theme) => ({ color: negative ? theme.colors.red[6] : theme.colors.teal[6] })}
                    size={28}
                    radius="md"
                >
                    <DiffIcon size={28} stroke={1.5} />
                </ThemeIcon>
            </Group>
            <Text color="dimmed" size="sm">
                <Text
                    component="span"
                    color={negative ? 'red' : 'teal'}
                    weight={700}
                >
                    {diff.toLocaleString(lang, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}%
                </Text>{' '}
                {negative ? 'worse' : 'better'} than country average
            </Text>
        </div>
    )
}

export default SmStatRow