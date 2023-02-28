import { Anchor, Divider, Stack, Title } from '@mantine/core';
import setLanguage from 'next-translate/setLanguage';
import useTranslation from 'next-translate/useTranslation';
import React, { useState } from 'react'
import i18nConfig from '../../i18n';
import { getLanguageById, LocaleItem } from '../../locales/localeUtil';

const FooterLanguageChoice = () => {
    const locales = i18nConfig.locales.map(locale => getLanguageById(locale)).filter(locale => locale !== undefined) as LocaleItem[];
    const { lang } = useTranslation('common');

    const [selectedIndex, setSelectedIndex] = useState(locales.findIndex(x => x.id === lang));
    // const { classes } = useStyles();

    const handleSelect = (index: number) => {
        setSelectedIndex(index);
        if (lang != locales[index].id) setLanguage(locales[index].id);
    }

    return (
        <Stack spacing={0}>
            <Title order={4}>
                Language
            </Title>
            {
                locales.map((locale, i) => (
                    <Anchor key={i} component='div' weight={i === selectedIndex ? "bold" : "normal"} onClick={() => handleSelect(i)}>
                        {locale.text}
                    </Anchor>
                ))
            }
        </Stack>
    );
}

export default FooterLanguageChoice