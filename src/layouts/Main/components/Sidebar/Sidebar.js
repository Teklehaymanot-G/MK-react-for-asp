import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
// import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
// import TextFieldsIcon from '@material-ui/icons/TextFields';
// import ImageIcon from '@material-ui/icons/Image';
// import AccountBoxIcon from '@material-ui/icons/AccountBox';
// import SettingsIcon from '@material-ui/icons/Settings';
// import LockOpenIcon from '@material-ui/icons/LockOpen';
import HouseIcon from '@material-ui/icons/House';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ReportIcon from '@material-ui/icons/ReportOutlined';

import { Profile, SidebarNav, SignOut } from './components';
import { getSessionValue } from 'session';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  // const pages = [
  //   {
  //     title: 'Dashboard',
  //     href: '/dashboard',
  //     icon: <DashboardIcon />
  //   },
  //   {
  //     title: 'አባላት',
  //     href: '/abalat',
  //     icon: <PeopleIcon />
  //   },
  //   {
  //     title: 'ማዕከል',
  //     href: '/maekel',
  //     icon: <ShoppingBasketIcon />
  //   },
  //   {
  //     title: 'Authentication',
  //     href: '/sign-in',
  //     icon: <LockOpenIcon />
  //   },
  //   {
  //     title: 'Typography',
  //     href: '/typography',
  //     icon: <TextFieldsIcon />
  //   },
  //   {
  //     title: 'Icons',
  //     href: '/icons',
  //     icon: <ImageIcon />
  //   },
  //   {
  //     title: 'Account',
  //     href: '/account',
  //     icon: <AccountBoxIcon />
  //   },
  //   {
  //     title: 'Settings',
  //     href: '/settings',
  //     icon: <SettingsIcon />
  //   },
  // ];

  const generalManagerpages = [
    {
      title: 'ቀዳሚ ገጽ',
      href: '/dashboard',
      icon: <DashboardIcon />
    },
    {
      title: 'አባላት',
      icon: <PeopleIcon />,
      values: [
        {
          title: 'የአባላት ዝርዝር',
          href: '/abalat'
        },
        {
          title: 'አባላት ይመዝግቡ',
          href: '/register-abalat'
        }
      ]
    },
    {
      title: 'ማዕከል',
      icon: <HouseIcon />,
      values: [
        {
          title: 'የማዕከል ዝርዝር',
          href: '/maekel'
        },
        {
          title: 'ማዕከል ይመዝግቡ',
          href: '/register-maekel'
        },
        {
          title: 'የማዕከል ማናጀር ዝርዝር',
          href: '/maekel-manager'
        }
      ]
    },
    {
      title: 'ማስተባበሪያ ኃላፊ',
      icon: <PersonAddIcon />,
      values: [
        {
          title: 'የማስተባበሪያ ኃላፊ ዝርዝር',
          href: '/general-manager'
        },
        {
          title: 'ማስተባበሪያ ኃላፊ ይመድቡ',
          href: '/assign-general-manager'
        },
        {
          title: 'ማስተባበሪያ ምክትል ኃላፊ ይመድቡ',
          href: '/assign-assistance-general-manager'
        }
      ]
    },
    // {
    //   title: 'ክፍል ኃላፊ',
    //   icon: <PersonAddIcon />,
    //   values: [
    //     {
    //       title: 'የክፍል ኃላፊ ዝርዝር',
    //       href: '#',
    //     },
    //     {
    //       title: 'ክፍል ኃላፊ ይመድቡ',
    //       href: '#',
    //     }
    //   ]
    // },
    {
      title: 'ሪፖርት',
      href: '/abalat-report',
      icon: <ReportIcon />
    }
  ];

  const maekelManagerpages = [
    {
      title: 'ቀዳሚ ገጽ',
      href: '/dashboard',
      icon: <DashboardIcon />
    },
    {
      title: 'አባላት',
      icon: <PeopleIcon />,
      values: [
        {
          title: 'የአባላት ዝርዝር',
          href: '/abalat'
        },
        {
          title: 'አባላት ይመዝግቡ',
          href: '/register-abalat'
        }
      ]
    },
    {
      title: 'ክፍል ኃላፊ',
      icon: <PersonAddIcon />,
      values: [
        {
          title: 'ክፍል ይመዝግቡ',
          href: '/register-kifil'
        },
        {
          title: 'የክፍል ኃላፊ ዝርዝር',
          href: '/kifil-manager'
        }
      ]
    },
    {
      title: 'ንዑስ ክፍል ኃላፊ',
      icon: <PersonAddIcon />,
      values: [
        {
          title: 'ንዑስ ክፍል ይመዝግቡ',
          href: '/register-sub-kifil'
        },
        {
          title: 'የንዑስ ክፍል አባላት ዝርዝር',
          href: '/sub-kifil-abalat'
        }
      ]
    }
    // {
    //   title: 'ሪፖርት',
    //   href: '/abalat-report',
    //   icon: <ReportIcon />,
    // },
  ];

  const kifilManagerpages = [
    {
      title: 'ቀዳሚ ገጽ',
      href: '/dashboard',
      icon: <DashboardIcon />
    },
    {
      title: 'የአባላት ዝርዝር',
      href: '/abalat',
      icon: <PeopleIcon />
    }
    // {
    //   title: 'ሪፖርት',
    //   href: '/abalat-report',
    //   icon: <ReportIcon />,
    // },
  ];

  getSessionValue('sessionAbalatId');

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}>
      <div {...rest} className={clsx(classes.root, className)}>
        <Profile />
        <Divider className={classes.divider} />

        <SidebarNav
          className={classes.nav}
          pages={
            getSessionValue('sessionUserType') === 'ማስተባበሪያ ኃላፊ'
              ? generalManagerpages
              : getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ'
              ? maekelManagerpages
              : kifilManagerpages
          }
        />

        <SignOut />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
