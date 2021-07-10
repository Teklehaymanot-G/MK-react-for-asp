import React, { useState } from 'react';
import PropTypes, { element } from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  Typography,
  Grid,
  DialogTitle,
  DialogActions,
  Divider
} from '@material-ui/core';
import xlsx from 'xlsx';

import { SearchInput } from 'components';
import { getSessionValue } from 'session';
import Axios from 'axios';
import { config } from 'config';
import { ImportMenu, ExportMenu } from './events';

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

const ToolbarClass = props => {
  const { className, value, onChangeValue, maekel, history, refreashListFunc, ...rest } = props;
  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <span className={classes.spacer} />
        <ImportMenu refreashListFunc={refreashListFunc} />
        <ExportMenu maekel={maekel} />

        <Button
          color="primary"
          variant="contained"
          onClick={() => history.push('register-maekel')}>
          Add Maekel
        </Button>
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Search center"
          value={value}
          onChange={onChangeValue}
        />
      </div>
    </div>
  );
};

ToolbarClass.propTypes = {
  className: PropTypes.string
  // history: PropTypes.string
};

export default ToolbarClass;
