import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { NavLink as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Button, colors, ListItem, } from '@material-ui/core';
import LockCloseIcon from '@material-ui/icons/Lock';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: colors.grey[50]
  },
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

const SignOut = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const CustomRouterLink = forwardRef((props, ref) => (
    <div
      ref={ref}
      style={{ flexGrow: 1 }}
    >
      <RouterLink {...props} />
    </div>
  ));

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      {/* <div className={classes.actions}>
        <Button
          color="primary"
          component="a"
          href="https://devias.io/products/devias-kit-pro"
          variant="contained"
        >
          Sign out
        </Button>
      </div> */}

      <ListItem className={classes.item} disableGutters key='Sign Out'>
        <Button
          activeClassName={classes.active}
          className={classes.button}
          component={CustomRouterLink}
          to='/sign-out'
          onClick={()=>console.log('asd')}
        >
          <div className={classes.icon}><LockCloseIcon /></div>
          Sign Out
        </Button>
      </ListItem>

      {/* <List component="div" disablePadding>
        <ListItem button className={classes.item}>
          <ListItemText className={classes.button} inset primary="Nested Page 1" />
        </ListItem>
      </List> */}
    </div>
  );
};

SignOut.propTypes = {
  className: PropTypes.string
};

export default SignOut;
