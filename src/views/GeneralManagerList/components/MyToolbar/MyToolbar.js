import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import { SearchInput } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const MyToolbar = props => {
  const { className, value, onChangeValue, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button className={classes.importButton}>Import</Button>
        <Button className={classes.exportButton}>Export</Button>
        <RouterLink to="/assign-general-manager">
          <Button
            color="primary"
            variant="contained"
          >
            Add user
          </Button>
        </RouterLink>        
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          value={value}
          onChange={onChangeValue}
          placeholder="Search user"
        />
      </div>
    </div>
  );
};

MyToolbar.propTypes = {
  className: PropTypes.string
};

export default MyToolbar;
