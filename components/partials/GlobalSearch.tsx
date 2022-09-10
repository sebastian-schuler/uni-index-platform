import { ActionIcon, createStyles, TextInput, useMantineTheme } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconSearch } from '@tabler/icons';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const useStyles = createStyles((theme) => ({

    background: {
        backgroundColor:
            theme.colorScheme === 'dark' ? theme.fn.rgba(theme.colors.red[8], 0.15) : theme.colors.light[0],
    },

    searchEnterIcon: {
        backgroundColor: theme.colors.brandGray[5],
        transition: "all .2s ease-in-out",

        '&:hover': {
            backgroundColor: theme.colors.brandOrange[5],
            transform: "scale(0.9)",
        },
    }

}));

const GlobalSearch: React.FC = () => {

    const theme = useMantineTheme();
    const { classes } = useStyles();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const router = useRouter();

    const { t } = useTranslation('common');
    const langContent = {
        globalSearch: t('global-search'),
    }

    const handleSearchClick = () => {
        if (searchTerm.length <= 0) return;
        router.push({ pathname: '/search', query: { q: searchTerm } });
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearchClick();
        }
    }

    return (
        <>
            <TextInput
                icon={<IconSearch size={18} stroke={1.5} />}
                radius="xl"
                size="md"
                rightSection={
                    <ActionIcon className={classes.searchEnterIcon} size={32} radius="xl" variant="filled">
                        {theme.dir === 'ltr' ? (
                            <IconArrowRight size={18} stroke={1.5} />
                        ) : (
                            <IconArrowLeft size={18} stroke={1.5} />
                        )}
                    </ActionIcon>
                }
                placeholder="Search..."
                rightSectionWidth={42}
                onClick={handleSearchClick}
                onKeyDown={handleKeyPress}
                classNames={{ input: classes.background }}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.currentTarget.value)}
            />
        </>
    )
}

export default GlobalSearch