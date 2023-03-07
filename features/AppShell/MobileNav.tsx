import { Box, createStyles, Drawer, Group, NavLink, Stack, Text, ActionIcon } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import ResponsiveContainer from '../../components/Container/ResponsiveContainer';
import { MenuLink } from './Shell';

const useStyles = createStyles((theme) => ({

    link: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
        borderRadius: theme.radius.sm,
        lineHeight: 1,
        fontWeight: 500,

        [`& .mantine-NavLink-label`]: {
            fontSize: theme.fontSizes.xl,
            lineHeight: 1,
        },

        [`&:hover`]: {
            backgroundColor: 'inherit',
        },
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: 'inherit',
        },
    },

    linkChild: {
        [`& .mantine-NavLink-label`]: {
            fontSize: theme.fontSizes.lg,
            lineHeight: 1,
        },
    },

    label: {
        color: theme.colors.brandGray[0],
        marginTop: theme.spacing.sm,
    }
}));

type Props = {
    opened: boolean
    toggle: () => void
    data: MenuLink[]
}

const MobileNav: React.FC<Props> = ({ opened, toggle, data }: Props) => {

    const { classes, cx, theme } = useStyles();
    const router = useRouter();

    const largeScreen = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
    const height = largeScreen ? 200 : 100;

    // Check if the route is the current route
    const isCurrentRoute = (rootUrl: string[]) => {
        return rootUrl.some((url) => {
            if (url === "" && router.route === "/") return true;
            if (url != "" && router.route.startsWith("/" + url)) return true;
            return false;
        });
    }

    const createItem = (item: MenuLink, i: number, isChild?: boolean) => {
        const isActive = isCurrentRoute(item.rootUrl);
        return (
            <NavLink
                key={i} label={item.label} active={isActive}
                component={Link} href={item.link}
                className={cx(classes.link, { [classes.linkChild]: isChild }, { [classes.linkActive]: isActive })}
                onClick={() => toggle()}
            />
        );
    };

    const links = data.map((item, i) => createItem(item, i));

    return (

        <Drawer
            opened={opened}
            onClose={() => toggle()}
            padding={0}
            size="sm"
            position='right'
            withCloseButton={false}
            zIndex={1000000}
        >
            <ResponsiveContainer>
                <Group position='apart' h={height}>
                    <Text size='xl' weight={700}>Menu</Text>
                    <ActionIcon size={'lg'} onClick={() => toggle()}>
                        <IconX size={28} color={theme.black} />
                    </ActionIcon>
                </Group>
                <Stack spacing={'sm'}>
                    {
                        links.map((item) => item)
                    }
                </Stack>
            </ResponsiveContainer>
        </Drawer>
    )
}

export default MobileNav