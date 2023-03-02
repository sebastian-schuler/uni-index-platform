import {
  Anchor,
  Burger, Center, createStyles, Group, Header, Menu, Text, UnstyledButton
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ResponsiveContainer from '../../components/Container/ResponsiveContainer';
import NavbarAccountMenu from './NavbarAccountMenu';
import { HEADER_HEIGHT, MenuLink } from './Shell';

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


type Props = {
  opened: boolean
  toggle: () => void
  data: MenuLink[]
}

const Navbar: React.FC<Props> = ({ opened, toggle, data }: Props) => {

  const { classes, cx } = useStyles();
  const router = useRouter();

  const items = data.map((link) => {

    if (link.type === "divider" || link.type === "label") return null;

    // Check if the route is the current route
    let isCurrent = link.rootUrl.some((url) => {
      if (url === "" && router.route === "/") return true;
      if (url != "" && router.route.startsWith("/" + url)) return true;
      return false;
    });

    let menuItems: (JSX.Element | null)[] = [];

    // Render a dropdown menu
    if (link.type === "group") {

      menuItems = link.children.map((item, i) => {
        
        if (item.type === "link") {
          return (<Menu.Item key={item.link} component={Link} href={item.link}>{item.label}</Menu.Item>);
        }

        if (item.type === "divider") {
          return (<Menu.Divider key={i} />);
        }

        if (item.type === "label") {
          return (<Menu.Label key={i}>{item.label}</Menu.Label>);
        }

        return null;
      });

      return (
        <Menu
          key={link.label}
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
                  <Text component='div' className={isCurrent ? classes.linkActive : undefined}>{link.label}</Text>
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
      <Anchor key={link.label} href={link.link} component={Link} className={classes.link}>
        <Text component='div' className={isCurrent ? classes.linkActive : undefined}>{link.label}</Text>
      </Anchor>
    );
  });

  return (
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
            color="#fff"
          />
        </div>
      </ResponsiveContainer>
    </Header>
  );
}

export default Navbar;