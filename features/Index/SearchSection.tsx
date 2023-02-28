import { createStyles, Stack, Text, Title } from '@mantine/core';
import ResponsiveContainer from '../../components/Container/ResponsiveContainer';
import GlobalSearch from '../GlobalSearch/GlobalSearch';
import useTranslation from 'next-translate/useTranslation';

const useStyles = createStyles((theme) => ({

}));

const SearchSection = () => {

    const { classes } = useStyles();
    const { t } = useTranslation('index');

    return (
        <ResponsiveContainer paddingY>
            <Stack>
                <Title order={2}>{t('search.title')}</Title>
                <Text>{t('search.desc')}</Text>
                <GlobalSearch />
            </Stack>
        </ResponsiveContainer>
    );
}

export default SearchSection