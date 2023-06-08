import {
  createStyles,
  Menu,
  Center,
  Header,
  Container,
  Group,
  Burger,
  Text,
  Avatar,
  Box,
  Drawer,
  ScrollArea,
  Paper,
} from '@mantine/core';
import { useDisclosure, useNetwork } from '@mantine/hooks';
import { NavLink } from 'react-router-dom';
import {
  IconChevronDown,
  IconUser,
  IconWifi,
  IconWifiOff,
} from '@tabler/icons';
import { ReactNode } from 'react';
import HasAuthority from '../has-authority/has-authority';

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eb4d4b',
    // backgroundColor: '#9b59b6',
    position: 'absolute',
    width: '100%',
    zIndex: 99999,
  },

  innerSub: {
    display: 'flex',
    alignItems: 'center',
    // backgroundColor: '#eb4d4b',
    // position: "absolute",
    // width: "100%",
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
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[0],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      // backgroundColor:
      //   theme.colorScheme === "dark"
      //     ? theme.colors.dark[6]
      //     : theme.colors.gray[0],
      color: 'white',
      // fontWeight: "bold",
    },
    '&:active': {
      textDecoration: 'none',
    },
  },

  subLink: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : '#eb4d4b',
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      // backgroundColor: "#eb4d4b",
      color: theme.colors.gray[9],
    },
    '&:active': {
      textDecoration: 'none',
    },
  },

  linkActivated: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    color: '#eb4d4b',
    // color: '#1a7b09',
  },

  linkLabel: {
    marginRight: 5,
  },

  linkDrawer: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: 'none',
    color: theme.colorScheme !== 'dark' ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan('sm')]: {
      height: 42,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      fontWeight: 'bold',
      // opacity: 0.2,
      color: theme.black,
    }),
  },

  subLinkDrawer: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    '&:active': theme.activeStyles,
  },

  hiddenMobile: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },
}));

export interface MainHeaderProps {
  links: {
    link: string;
    label: string;
    privileges?: string[];
    links?: { link: string; label: string; privileges?: string[] }[];
  }[];
  user?: string;
  location?: string;
  logoutComponent?: ReactNode;
}

export function MainHeader({
  links,
  user,
  location,
  logoutComponent,
}: MainHeaderProps) {
  const networkStatus = useNetwork();
  const { classes } = useStyles();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const getNameInitials = (names: string): string => {
    const namesSplit = names.split(' ');
    const initials = namesSplit[0][0] + namesSplit[1][0];
    return initials.toUpperCase();
  };

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <HasAuthority authorities={item.privileges || []} key={item.link}>
        <Menu.Item key={item.link}>
          <NavLink
            to={item.link}
            className={({ isActive }) =>
              isActive ? classes.linkActivated : classes.subLink
            }
          >
            {item.label}
          </NavLink>
        </Menu.Item>
      </HasAuthority>
    ));

    if (menuItems) {
      return (
        <HasAuthority authorities={link.privileges || []} key={link.link}>
          <Menu
            key={link.label}
            offset={0}
            withArrow
            trigger="hover"
            exitTransitionDuration={100}
          >
            <Menu.Target>
              <div className={classes.link}>
                <Center>
                  <span className={classes.linkLabel}>{link.label}</span>
                  <IconChevronDown size={12} stroke={1.5} />
                </Center>
              </div>
            </Menu.Target>
            <Menu.Dropdown className={classes.innerSub}>
              {menuItems}
            </Menu.Dropdown>
          </Menu>
        </HasAuthority>
      );
    }

    return (
      <HasAuthority authorities={link.privileges || []} key={link.link}>
        <NavLink key={link.label} to={link.link} className={classes.link}>
          {link.label}
        </NavLink>
      </HasAuthority>
    );
  });

  const drawerItems = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>
        <NavLink
          to={item.link}
          className={({ isActive }) =>
            isActive ? classes.linkActivated : classes.subLink
          }
        >
          {item.label}
        </NavLink>
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          offset={0}
          withArrow
          trigger="hover"
          exitTransitionDuration={100}
        >
          <Menu.Target>
            <div
              // to={link.link}
              className={classes.linkDrawer}
              // end
              // onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size={12} stroke={1.5} />
                {/* <FontAwesomeIcon icon={faChevronDown} size={"xs"} /> */}
              </Center>
            </div>
          </Menu.Target>
          <Menu.Dropdown className={classes.innerSub}>
            {menuItems}
          </Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <NavLink
        key={link.label}
        to={link.link}
        className={classes.linkDrawer}
        // onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </NavLink>
    );
  });

  return (
    <Box>
      <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb={0}>
        <Container className={classes.inner} fluid>
          <Group>
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              className={classes.hiddenDesktop}
              color="#fff"
            />
            {/* <Burger
              opened={opened}
              onClick={toggle}
              className={classes.burger}
              size="sm"
            /> */}
            {/* <MantineLogo size={28} /> */}
            <Text size={'xl'} color={'gray.0'} weight={'bold'} italic>
              Dreams Web
            </Text>
          </Group>
          {/* <HasAuthority privileges={['Get Patients']}> */}
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>
          {/* </HasAuthority> */}

          <Group className={classes.hiddenMobile}>
            <Menu
              offset={0}
              withArrow
              trigger={'hover'}
              exitTransitionDuration={100}
            >
              <Menu.Target>
                <div className={classes.link}>
                  <Group>
                    <Avatar radius={'lg'}>
                      {user && getNameInitials(user)}
                    </Avatar>
                    <span className={classes.linkLabel}>
                      <Text
                        color={'gray.0'}
                        size={'sm'}
                        style={{ maxWidth: 150, width: 100 }}
                      >
                        {user}
                      </Text>
                    </span>
                    <IconChevronDown size={12} stroke={1.5} />
                  </Group>
                </div>
              </Menu.Target>
              <Menu.Dropdown className={classes.innerSub}>
                <Menu.Item icon={<IconUser />}>
                  <NavLink
                    to={'/profile'}
                    className={({ isActive }) =>
                      isActive ? classes.linkActivated : classes.subLink
                    }
                  >
                    Mon Profile
                  </NavLink>
                </Menu.Item>
                {logoutComponent || ''}
                {/* { ? <div>{logoutComponent}</div> : null} */}

                {/* <Button
                  leftIcon={<IconLogout />}
                  type="submit"
                  variant={'light'}
                  color={'red'}
                >
                  Déconnexion
                </Button> */}
                {/* <Menu.Item icon={<IconLogout />}>
              </Menu.Item> */}
                {/* <NavLink
                  to={'/logout'}
                  className={({ isActive }) =>
                    isActive ? classes.linkActivated : classes.subLink
                  }
                >
                  Déconnexion
                </NavLink> */}
              </Menu.Dropdown>
            </Menu>

            <div className={classes.hiddenMobile}>
              <Text style={{ maxWidth: 200, width: 200 }} color={'gray.0'}>
                {location}
              </Text>
            </div>
          </Group>
          <Text>
            {networkStatus.online ? (
              <Group>
                <Text color={'gray.0'} weight={'bold'}>
                  En ligne
                </Text>
                <IconWifi size={'50'} color={'white'} />
              </Group>
            ) : (
              <Paper withBorder px={'xs'}>
                <Group>
                  <Text color={'red'} weight={'bold'}>
                    Hors ligne
                  </Text>
                  <IconWifiOff size={'50'} color={'red'} />
                </Group>
              </Paper>
            )}
          </Text>
        </Container>
      </Header>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea
          sx={{ height: 'calc(100vh - 60px)', backgroundColor: '#eb4d4b' }}
          mx="-md"
        >
          {/* <Divider
            my="sm"
            color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'}
          /> */}
          {drawerItems}
          <Menu
            offset={0}
            withArrow
            trigger="click"
            exitTransitionDuration={100}
          >
            <Menu.Target>
              <div className={classes.link}>
                <Group>
                  <Avatar radius={'lg'}>SU</Avatar>
                  <span className={classes.linkLabel}>
                    <Text
                      color={'gray.0'}
                      size={'sm'}
                      style={{ maxWidth: 150, width: 100 }}
                    >
                      {user}
                    </Text>
                  </span>
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </div>
            </Menu.Target>
            <Menu.Dropdown className={classes.innerSub}>
              <Menu.Item icon={<IconUser />}>
                <NavLink
                  to={'/profile'}
                  className={({ isActive }) =>
                    isActive ? classes.linkActivated : classes.subLink
                  }
                >
                  Mon Profile
                </NavLink>
              </Menu.Item>
              {logoutComponent}

              {/* <Button
                leftIcon={<IconLogout />}
                type="submit"
                variant={'light'}
                color={'red'}
              >
                Déconnexion
              </Button> */}
            </Menu.Dropdown>
          </Menu>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
