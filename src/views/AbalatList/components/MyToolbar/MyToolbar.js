import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Button, TextField } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import { SearchInput } from 'components';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Axios from 'axios';
import { config } from 'config';
import { getSessionValue } from 'session';
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

const MyToolbar = props => {
  const {
    className,
    value,
    maekelInfo,
    onChangeValue,
    setAbalat,
    abalat,
    ...rest
  } = props;

  const classes = useStyles();

  const buildAutocomplete = (label, name, multiple, required, options) => {
    return (
      <Autocomplete
        multiple={multiple}
        name={name}
        style={{ width: '25%' }}
        options={options}
        getOptionLabel={option => option.name}
        // defaultValue={[top100Films[13]]}
        onChange={(event, value) => {
          event.persist();

          var url = `${config.LOCATION()}abalat`;
          if (value !== null)
            url = `${config.LOCATION()}abalat/get-by-maekel/${value.maekel_id}`;

          Axios.get(url).then(response => {
            console.log(response)
            setAbalat(response.data.data);
          });
        }}
        renderInput={params => (
          <TextField
            {...params}
            style={{ padding: '1.5px 4px' }}
            required={required}
            variant="outlined"
            label={label}
            margin="dense"
            fullWidth
          />
        )}
      />
    );
  };

  const cloneArray = array => {
    return array.map(({ name, age }) => ({ name, age }));
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button className={classes.importButton}>Import</Button>
        <Button
          className={classes.exportButton}
          onClick={() => {
            var filtered = cloneArray(abalat);
            var WB = xlsx.utils.book_new();
            var WS = xlsx.utils.json_to_sheet(filtered);
            xlsx.utils.book_append_sheet(WB, WS, 'abalat');
            xlsx.writeFile(WB, 'abalat data.xlsx');
          }}>
          Export
        </Button>
        {getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ' ? (
          ''
        ) : (
          <RouterLink to="/register-abalat">
            <Button color="primary" variant="contained">
              Add user
            </Button>
          </RouterLink>
        )}
      </div>
      <div
        className={classes.row}
        style={{ display: 'flex', justifyContent: 'start' }}>
        <SearchInput
          className={classes.searchInput}
          // className={classes.textField}
          value={value}
          onChange={onChangeValue}
          placeholder="Search abalat"
          margin="dense"
          style={{ width: '30%' }}
        />

        {getSessionValue('sessionUserType') === 'ማስተባበሪያ ኃላፊ'
          ? buildAutocomplete('የማዕከል ስም', 'maekelId', false, false, maekelInfo)
          : ''}
      </div>
    </div>
  );
};

MyToolbar.propTypes = {
  className: PropTypes.string
};

export default MyToolbar;
