import { createStyles, Group, SimpleGrid, Text, UnstyledButton } from '@mantine/core';
import { IconPencilPlus } from '@tabler/icons-react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    title: {
        fontWeight: 700,
    },

    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: theme.radius.md,
        height: 90,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'box-shadow 150ms ease, transform 100ms ease',

        '&:hover': {
            boxShadow: `${theme.shadows.md} !important`,
            transform: 'scale(1.05)',
        },
    },
}));



const AccountActions = () => {

    const { classes, theme } = useStyles();
    const { t } = useTranslation('account');

    const data = [
        { title: t('index.actions.create-ad'), icon: IconPencilPlus, url: '/account/create-ad' },
    ];

    const items = data.map((item) => (
        <UnstyledButton key={item.title} component={Link} href={item.url} className={classes.item}>
            <item.icon color={theme.colors.brandOrange[5]} size={32} />
            <Text size="sm" mt={7}>
                {item.title}
            </Text>
        </UnstyledButton>
    ));

    return (
        <>
            <Group position="apart">
                <Text className={classes.title}>{t('index.actions.label')}</Text>
            </Group>
            <SimpleGrid cols={3} mt="md">
                {items}
            </SimpleGrid>
        </>
    )
}

export default AccountActions