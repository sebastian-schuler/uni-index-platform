import {
  Anchor,
  Burger, Center, createStyles, Divider, Drawer, Group, Header, Menu, Stack, Text, UnstyledButton
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { URL_CATEGORIES, URL_CATEGORY, URL_INSTITUTION, URL_INSTITUTIONS, URL_LOCATION, URL_LOCATIONS } from '../../lib/url-helper/urlConstants';
import { toLink } from '../../lib/util/util';
import ResponsiveContainer from '../../components/Container/ResponsiveContainer';
import NavbarAccountMenu from './NavbarAccountMenu';

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
    fontSize: theme.fontSizes.lg,

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

  linkActive: {
    fontWeight: 800,
    borderBottom: `2px solid ${theme.white}`,
  },

  linkLabel: {
    marginRight: 5,
  },

  menuDropdown: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
  },

  menuItem: {
    '&[data-hovered]': {
      backgroundColor: theme.fn.rgba(theme.colors[theme.primaryColor][theme.fn.primaryShade()], 0.85),
      color: theme.colors.light[0],
    },
  },

  menuItemLabel: {
    fontSize: theme.fontSizes.md,
  },

  menuLabel: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.brandOrange[5],
  },

  menuDivider: {
    borderColor: theme.colors.dark[0],
  }

}));

type MenuLink = {
  label: string;
  link: string;
}

type MenuChildren = MenuLink & { type: 'link' } | { type: 'divider' } | { type: 'label', text: string };

type MenuLinkRoot = {
  parent: MenuLink
  rootUrl: string[];
  children: MenuChildren[]
}

const Navbar: React.FC = () => {

  const { t } = useTranslation("common");

  const links: MenuLinkRoot[] = [
    { parent: { label: t('nav.home'), link: "/" }, rootUrl: [""], children: [] },
    { parent: { label: t('nav.locations'), link: toLink(URL_LOCATIONS) }, rootUrl: [URL_LOCATION], children: [] },
    { parent: { label: t('nav.categories'), link: toLink(URL_CATEGORIES) }, rootUrl: [URL_CATEGORY, URL_CATEGORIES], children: [] },
    { parent: { label: t('nav.institutions'), link: toLink(URL_INSTITUTIONS) }, rootUrl: [URL_INSTITUTION], children: [] },
    {
      parent: { label: t('nav.analysis.title'), link: "/social-media" }, rootUrl: ["social-media"], children: [
        { type: 'label', text: t('nav.analysis.social-media-label') },
        { type: 'link', label: t('nav.analysis.social-media-ranking'), link: "/social-media/ranking" },
        { type: 'link', label: t('nav.analysis.social-media-statistics'), link: "/social-media/statistics" },
        { type: 'divider' },
        { type: 'label', text: t('nav.analysis.online-marketing-label') },
        { type: 'link', label: t('nav.analysis.online-marketing-ranking'), link: "#ranking" },
        { type: 'link', label: t('nav.analysis.online-marketing-statistics'), link: "#statistics" },
      ]
    },
  ];

  const [opened, { toggle }] = useDisclosure(false);
  const { classes, cx } = useStyles();
  const router = useRouter();

  const items = links.map((link) => {

    const menuItems = link.children?.map((item, i) => {

      if (item.type === "link")
        return (<Menu.Item key={item.link} component={Link} href={item.link}>{item.label}</Menu.Item>);

      if (item.type === "divider")
        return (<Menu.Divider key={i} />);

      if (item.type === "label")
        return (<Menu.Label key={i}>{item.text}</Menu.Label>);
    });

    // Check if the route is the current route
    let isCurrent = link.rootUrl.some((url) => {
      if (url === "" && router.route === "/") return true;
      if (url != "" && router.route.startsWith("/" + url)) return true;
      return false;
    });

    if (menuItems && menuItems.length > 0) {
      return (
        <Menu
          key={link.parent.label}
          trigger="hover"
          exitTransitionDuration={100}
          classNames={{
            itemLabel: classes.menuItemLabel,
            label: classes.menuLabel,
            divider: classes.menuDivider,
            item: classes.menuItem,
            dropdown: classes.menuDropdown,
          }}
        >
          <Menu.Target>
            <UnstyledButton className={classes.link} sx={{ userSelect: 'none' }}>
              <Center>
                <div className={classes.linkLabel}>
                  <Text component='div' className={isCurrent ? classes.linkActive : undefined}>{link.parent.label}</Text>
                </div>
                <IconChevronDown size={12} stroke={1.5} />
              </Center>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Anchor key={link.parent.label} href={link.parent.link} component={Link} className={classes.link}>
        <Text component='div' className={isCurrent ? classes.linkActive : undefined}>{link.parent.label}</Text>
      </Anchor>
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
              <NavbarAccountMenu />
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
        padding="lg"
        size="lg"
        position='right'
        withCloseButton={false}
      >
        <Stack spacing={0} mt={HEADER_HEIGHT}>
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

export default Navbar;