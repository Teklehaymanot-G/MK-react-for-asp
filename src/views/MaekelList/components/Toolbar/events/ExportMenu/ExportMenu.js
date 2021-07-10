import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid
} from '@material-ui/core';
import { getSessionValue } from 'session';
import { config } from 'config';
import Axios from 'axios';
import xlsx from 'xlsx';

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

const ExportMenu = props => {
  const { className, maekel, ...rest } = props;
  const classes = useStyles();

  const cloneArray = array => {
    return array.map(({ name, location, description, status }) => ({
      name,
      location,
      description,
      status
    }));
  };

  return (
    <div>
      <Button
        className={classes.exportButton}
        onClick={() => {
          var fieltered = cloneArray(maekel);
          var fieltered = fieltered.map(function(record) {
            if (record.status == 1) record.status = 'On';
            else if (record.status == 0) record.status = 'Off';
            return record;
          });
          var WB = xlsx.utils.book_new();
          var WS = xlsx.utils.json_to_sheet(fieltered);
          xlsx.utils.book_append_sheet(WB, WS, 'Sheet 1');
          xlsx.writeFile(WB, 'maekel data.xlsx');
        }}>
        Export
      </Button>
    </div>
  );
};

ExportMenu.propTypes = {
  className: PropTypes.string
};

export default ExportMenu;
