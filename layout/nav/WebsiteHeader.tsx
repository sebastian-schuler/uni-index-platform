import {
  Anchor,
  Burger, Button, Center, createStyles, Divider, Drawer, Group, Header, Menu, Stack, Text, UnstyledButton
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NextLink } from '@mantine/next';
import { IconChevronDown } from '@tabler/icons';
import Link from 'next/link';
import ResponsiveContainer from '../ResponsiveContainer';
import HeaderAccountMenu from './HeaderAccountMenu';

export const HEADER_HEIGHT = 64;

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
    borderBottom: 0,
    color: theme.white,
    boxShadow: theme.shadows.sm,
  },

  inner: {
    height: HEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.white,
    fontSize: theme.fontSizes.md,
    fontWeight: 500,

    [theme.fn.smallerThan('sm')]: {
      color: theme.black,
      padding: '12px 12px',
    },

    '&:hover': {
      textDecoration: 'none',
      [theme.fn.largerThan('sm')]: {
        backgroundColor: theme.fn.lighten(
          theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background || "",
          0.1
        ),
      },
    },
  },

  linkLabel: {
    marginRight: 5,
  },

}));

interface LinkProps {
  label: string;
  link: string;
}

interface NestedLinkProps {
  parent: LinkProps
  children: LinkProps[]
}

const WebsiteHeader = () => {

  const links: NestedLinkProps[] = [
    { parent: { label: "Home", link: "/" }, children: [] },
    { parent: { label: "Locations", link: "/locations" }, children: [] },
    { parent: { label: "Subjects", link: "/subjects" }, children: [] },
    { parent: { label: "Institutions", link: "/institutions" }, children: [] },
    {
      parent: { label: "Social-Media", link: "/social-media" }, children: [
        { label: "Social-Media Ranking", link: "/social-media/ranking" },
        { label: "Statistics", link: "/social-media/statistics" }
      ]
    },
  ]

  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();

  const items = links.map((link) => {

    const menuItems = link.children?.map((item) => (
      <Menu.Item key={item.link} component={NextLink} href={item.link}>{item.label}</Menu.Item>
    ));

    if (menuItems && menuItems.length > 0) {
      return (
        <Menu key={link.parent.label}  trigger="hover" exitTransitionDuration={100}>
          <Menu.Target>
            <UnstyledButton className={classes.link} sx={{ userSelect: 'none' }}>
              <Center>
                <span className={classes.linkLabel}>{link.parent.label}</span>
                <IconChevronDown size={12} stroke={1.5} />
              </Center>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link key={link.parent.label} href={link.parent.link} passHref>
        <Anchor component='a' className={classes.link}>
          {link.parent.label}
        </Anchor>
      </Link>
    );
  });

  return (
    <>
      <Header height={HEADER_HEIGHT} className={classes.header} fixed >
        <ResponsiveContainer>
          <div className={classes.inner}>
            <Text size={'xl'} weight={"bolder"}>Uni-Index</Text>
            <Group spacing={4} className={classes.links}>
              <Group spacing={4}>
                {items}
              </Group>
              <HeaderAccountMenu />
            </Group>
            <Burger
              opened={opened}
              onClick={toggle}
              className={classes.burger}
              size="sm"
              color="#fff"
            />
          </div>
        </ResponsiveContainer>
      </Header>

      <Drawer
        opened={opened}
        onClose={() => toggle()}
        title="Uni-Index navigation"
        padding="xl"
        size="lg"
        position='right'
        closeButtonLabel="Close drawer"
      >
        <Stack spacing={0}>
          {
            items.map((item, i) => (
              <div key={item.key}>
                {item}
                {i !== items.length - 1 && <Divider p={0} m={0} />}
              </div>
            ))
          }
        </Stack>
      </Drawer>
    </>
  );
}

export default WebsiteHeader;