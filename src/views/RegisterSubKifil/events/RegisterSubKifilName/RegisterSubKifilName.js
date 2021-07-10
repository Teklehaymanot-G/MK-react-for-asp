import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import validate from 'validate.js';
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
  Grid,
  TextField
} from '@material-ui/core';
import { getSessionValue } from 'session';
import { config } from 'config';
import Axios from 'axios';
import AddIcon from '@material-ui/icons/AddBox';

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 3
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {},
  imageContainer: {
    height: 64,
    width: 64,
    margin: '0 auto',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '5px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%'
  },
  statsItem: {
    display: 'flex',
    alignItems: 'center'
  },
  statsIcon: {
    color: theme.palette.icon,
    marginRight: theme.spacing(1)
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: 'unset'
  },
  status: {
    marginRight: theme.spacing(1)
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    // paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2)
  }
}));

const RegisterSubKifilName = props => {
  const { className, setUpdateListRequired, history, ...rest } = props;
  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      name: '',
      description: '',
      createdBy: getSessionValue('sessionAbalatId')
    },
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
    // eslint-disable-next-line
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      },
      errors: {
        ...formState.errors
      }
    }));
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const [kifilError, setkifilError] = useState(false);
  const [openKifilModal, setOpenKifilModal] = useState(false);

  const handleModalOpen = () => {
    setOpenKifilModal(true);
  };
  const handleModalClose = () => {
    setOpenKifilModal(false);
  };

  const registerSubKifilName = event => {
    event.preventDefault();

    Axios.post(`${config.LOCATION()}sub-kifil/add`, {
      ...formState.values
    }).then(response => {
      console.log(response);
      if (response.data.success) {
        setkifilError(false);
        //to update auto complete list
        setUpdateListRequired(true);
        handleModalClose();
      } else {
        setUpdateListRequired(false);
        setkifilError(true);
      }
    });
  };

  const buildAlertBoxOnModal = () => {
    if (!kifilError) return <div></div>;
    else
      return (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert">
          <strong>Error </strong> ይቅርታ ሲስተሙ ችግር አጋጥሞታል። እባክዎ ደግመው ይሞክሩ።
        </div>
      );
  };
  const buildTextFields = (
    label,
    name,
    value,
    error,
    select,
    list,
    requeired,
    type
  ) => {
    return (
      <TextField
        className={classes.textField}
        error={hasError(name)}
        fullWidth
        required={requeired}
        helperText={hasError(name) ? error[0] : null}
        label={label}
        name={name}
        onChange={handleChange}
        type={type}
        value={value || ''}
        select={select}
        SelectProps={{ native: true }}
        variant="outlined"
      />
    );
  };
  const buildTextArea = (rows, rowsMax, label, name, value, error) => {
    return (
      <TextField
        className={classes.textField}
        fullWidth
        multiline
        rows={rows}
        rowsMax={rowsMax}
        helperText={hasError(name) ? error[0] : null}
        label={label}
        name={name}
        onChange={handleChange}
        type="text"
        value={value || ''}
        variant="outlined"
      />
    );
  };

  return (
    <div>
      <Typography
        component="span"
        varient="body2"
        {...rest}
        className={clsx(classes.root, className, classes.statusContainer)}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: 'column'
        }}>
        <Button onClick={handleModalOpen}>
          <AddIcon htmlColor="#cc0000" /> ንዑስ ክፍል ይመዝግቡ
        </Button>
      </Typography>

      <Dialog
        open={openKifilModal}
        onClose={handleModalClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}>
        <DialogTitle id="form-dialog-title" style={{ background: '#F0F0F0' }}>
          <div style={{ textAlign: 'center' }}>
            <h3>የንዑስ ክፍል ስም ይመዝግቡ</h3>
          </div>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={registerSubKifilName}>
            <DialogContentText>
              <Typography component="span" style={{ display: 'flex' }}>
                <Grid
                  component="span"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%'
                  }}>
                  <div style={{ width: '10%' }}></div>
                  <form
                    style={{ width: '80%' }}
                    onSubmit={registerSubKifilName}>
                    {buildAlertBoxOnModal()}
                    {buildTextFields(
                      'የንዑስ ክፍል ስም',
                      'name',
                      formState.values.name,
                      formState.errors.name,
                      false,
                      [],
                      true,
                      'text'
                    )}
                    {buildTextArea(
                      3,
                      5,
                      'ተጨማሪ',
                      'description',
                      formState.values.description,
                      formState.errors.description
                    )}
                  </form>
                </Grid>
              </Typography>
            </DialogContentText>
            <DialogActions>
              <Button disabled={!formState.isValid} type="submit">
                ይመዝግቡ
              </Button>
              <Button onClick={handleModalClose}>Close</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

RegisterSubKifilName.propTypes = {
  className: PropTypes.string,
  maekel: PropTypes.object.isRequired
};

export default RegisterSubKifilName;
