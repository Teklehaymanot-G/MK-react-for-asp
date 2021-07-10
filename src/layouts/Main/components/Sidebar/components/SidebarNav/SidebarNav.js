/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  List,
  ListItem,
  Button,
  colors,
  Collapse,
  Divider,
  ListItemText,
  ListItemIcon,
  Typography
} from '@material-ui/core';

import IconExpandLess from '@material-ui/icons/ExpandLess';
import IconExpandMore from '@material-ui/icons/ExpandMore';
// import IconDashboard from '@material-ui/icons/Dashboard'
// import IconShoppingCart from '@material-ui/icons/ShoppingCart'
// import IconPeople from '@material-ui/icons/People'
// import IconBarChart from '@material-ui/icons/BarChart'
// import IconLibraryBooks from '@material-ui/icons/LibraryBooks'

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div ref={ref} style={{ flexGrow: 1 }}>
    <RouterLink {...props} />
  </div>
));

const SidebarNav = props => {
  const { pages, className, ...rest } = props;

  const classes = useStyles();

  const [openAbalat, setOpenAbalat] = React.useState(false);
  const [openMaekel, setOpenMaekel] = React.useState(false);
  const [openGM, setOpenGM] = React.useState(false);
  const [openMM, setOpenMM] = React.useState(false);
  const [openKM, setOpenKM] = React.useState(false);
  const [openSK, setOpenSK] = React.useState(false);

  const buildSimpleItem = page => (
    <ListItem className={classes.item} disableGutters key={page.title}>
      <Button
        activeClassName={classes.active}
        className={classes.button}
        component={CustomRouterLink}
        to={page.href}>
        <div className={classes.icon}>{page.icon}</div>
        {page.title}
      </Button>
    </ListItem>
  );

  const buildNestedItem = (page, val, setVal) => (
    <Typography component="span" variant="body2" key={page.title}>
      <ListItem
        button
        disableGutters
        onClick={() => setVal(!val)}
        className={classes.item}>
        <ListItemIcon className={classes.button} component={CustomRouterLink}>
          <div className={classes.icon}>{page.icon}</div>
          <ListItemText primary={page.title} />
          {val ? <IconExpandLess /> : <IconExpandMore />}
        </ListItemIcon>
      </ListItem>

      <Collapse in={val} timeout="auto" unmountOnExit>
        <Divider />
        <List component="div" disablePadding>
          {page.values.map(p => buildSimpleItem(p))}
        </List>
      </Collapse>
    </Typography>
  );

  const renderSwitch = page => {
    if (page.title === 'አባላት')
      return buildNestedItem(page, openAbalat, setOpenAbalat);
    else if (page.title === 'ማዕከል')
      return buildNestedItem(page, openMaekel, setOpenMaekel);
    else if (page.title === 'ማስተባበሪያ ኃላፊ')
      return buildNestedItem(page, openGM, setOpenGM);
    else if (page.title === 'ማዕከል ኃላፊ')
      return buildNestedItem(page, openMM, setOpenMM);
    else if (page.title === 'ክፍል ኃላፊ')
      return buildNestedItem(page, openKM, setOpenKM);
    else if (page.title === 'ንዑስ ክፍል ኃላፊ')
      return buildNestedItem(page, openSK, setOpenSK);
  };
  
  return (
    <List {...rest} className={clsx(classes.root, className)}>
      {pages.map(page => {
        return page.values === undefined
          ? buildSimpleItem(page)
          : renderSwitch(page);
        // return renderSwitch(page)
      })}
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default SidebarNav;
