import { createStyles, Divider, Drawer, NavLink, Stack, Text } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { HEADER_HEIGHT, MenuLink } from './Shell';

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

    // Check if the route is the current route
    const isCurrentRoute = (rootUrl: string[]) => {
        return rootUrl.some((url) => {
            if (url === "" && router.route === "/") return true;
            if (url != "" && router.route.startsWith("/" + url)) return true;
            return false;
        });
    }

    const createItem = (item: MenuLink, i: number, isChild?: boolean) => {
        if (item.type === "link") {
            const isActive = isCurrentRoute(item.rootUrl);
            return (
                <NavLink
                    key={i} label={item.label} active={isActive}
                    component={Link} href={item.link}
                    className={cx(classes.link, { [classes.linkChild]: isChild }, { [classes.linkActive]: isActive })}
                    onClick={() => toggle()}
                />
            );
        }
        if (item.type === "divider") {
            return (<Divider key={i} />);
        }
        if (item.type === "label") {
            return (<Text key={i} className={classes.label}>{item.label}</Text>);
        }
        if (item.type === "group") {
            return (
                <NavLink
                    key={i}
                    label={item.label}
                    childrenOffset={theme.spacing.md * 2}
                    active={isCurrentRoute(item.rootUrl)}
                    className={classes.link}
                >
                    {item.children.map((child, y) => createItem(child, y, true))}
                </NavLink>
            );
        }
    };

    const links = data.map((item, i) => createItem(item, i));

    return (

        <Drawer
            opened={opened}
            onClose={() => toggle()}
            padding="lg"
            size="lg"
            position='right'
            withCloseButton={false}
        >
            <Stack spacing={'sm'} mt={HEADER_HEIGHT}>
                {
                    links.map((item) => item)
                }
            </Stack>
        </Drawer>
    )
}

export default MobileNav