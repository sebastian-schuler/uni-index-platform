import { createStyles, Stack, Title } from '@mantine/core';
import ResponsiveContainer from '../ResponsiveContainer';
import GlobalSearch from '../../components/partials/GlobalSearch';

const useStyles = createStyles((theme) => ({

}));

const SearchSection = () => {

    const { classes } = useStyles();

    return (
        <ResponsiveContainer paddingY>

            <Stack>
                <Title order={1}>
                    Search
                </Title>

                <GlobalSearch />
            </Stack>
        </ResponsiveContainer>
    );
}

export default SearchSection