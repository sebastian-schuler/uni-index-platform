import { Anchor, createStyles, Divider, Stack, Text } from '@mantine/core';
import setLanguage from 'next-translate/setLanguage';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import i18nConfig from '../../i18n';
import { getLanguageById, LocaleItem } from '../../locales/localeUtil';

const useStyles = createStyles((theme) => ({

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        textDecoration: 'none',
        fontSize: theme.fontSizes.md,
        fontWeight: 400,
        color: theme.black,
        '&:hover': {
            backgroundColor: theme.fn.darken(theme.colors.gray[0], 0.1),
        },
    },

    linkSelected: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        fontSize: theme.fontSizes.md,
        fontWeight: 500,
        backgroundColor: theme.fn.lighten(
            theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background || "",
            0.1
        ),
        color: theme.white,
    },

}));
const LanguageSettings = () => {

    const locales = i18nConfig.locales.map(locale => getLanguageById(locale)).filter(locale => locale !== undefined) as LocaleItem[];
    const { t, lang } = useTranslation('common');

    const [selectedIndex, setSelectedIndex] = useState(locales.findIndex(x => x.id === lang));
    const { classes } = useStyles();

    const handleSelect = (index: number) => {
        setSelectedIndex(index);
        if (lang != locales[index].id) setLanguage(locales[index].id);
    }
    return (
        <Stack spacing={"xs"} sx={{ maxWidth: 400 }}>
            <Text size={'lg'} weight={500}>{t('settings.language-label')}</Text>
            <Stack spacing={0}>
                {
                    locales.map((locale, i) => (
                        <Anchor key={i} component='div' className={i === selectedIndex ? classes.linkSelected : classes.link} onClick={() => handleSelect(i)}>
                            {locale.text}
                        </Anchor>
                    ))
                }
            </Stack>
        </Stack>
    )
}

export default LanguageSettings