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
import EditIcon from '@material-ui/icons/EditOutlined';
import { getSessionValue } from 'session';
import { config } from 'config';
import Axios from 'axios';

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
  },
}));

const ChangeStatus = props => {
  const { className, maekel, ...rest } = props;
  const classes = useStyles();

  const schema = {
    name: {
      presence: { allowEmpty: false, message: 'is required'},
      length: {
        maximum: 50
      }
    },
    location: {
      presence: { allowEmpty: false, message: 'is required' },
      length: {
        maximum: 50
      }
    }
  };

  const [formStateEdit, setFormStateEdit] = useState({
    isValid: false,
    values: {
      location: maekel.location,
      name: maekel.name,
      description: maekel.description,
      modifiedBy: getSessionValue('sessionAbalatId')
    },
    touched: {},
    errors: {}
  });


  useEffect(() => {
    const errors = validate(formStateEdit.values, schema);

    setFormStateEdit(formStateEdit => ({
      ...formStateEdit,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
    // eslint-disable-next-line
  }, [formStateEdit.values]);


  const handleChange = event => {
    event.persist();

    if(event.target.name === 'name')
      event.target.value = event.target.value.toUpperCase();

    setFormStateEdit(formStateEdit => ({
      ...formStateEdit,
      values: {
        ...formStateEdit.values,
        [event.target.name]: event.target.value,
      },
      touched: {
        ...formStateEdit.touched,
        [event.target.name]: true
      }
    }));
  };

  const hasError = field =>
    formStateEdit.touched[field] && formStateEdit.errors[field] ? true : false;

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editError, setEditError] = useState(false);

  const handleEditModalOpen = () => {
    setOpenEditModal(true);
  }
  const handleEditModalClose = () => {
    setOpenEditModal(false);
  }

  const editMaekel = () => {
    // const changeStatusProps = {
    //   table: 'maekel',
    //   idCol: 'maekel_id',
    //   id: maekel.maekel_id,
    //   status: maekel.status === 1 ? 0 : 1,
    //   modifiedBy: getSessionValue('sessionAbalatId')
    // }

    Axios.put(`${config.LOCATION()}maekel/edit/${maekel.maekel_id}`, {...formStateEdit.values})
      .then(response => {
        if(response.data.success){
          maekel.name = formStateEdit.values.name;
          maekel.location = formStateEdit.values.location;
          maekel.description = formStateEdit.values.description;
          setEditError(false);
          handleEditModalClose();
        }
        else{
          setEditError(true);
        }
      });
  };

  const buildAlertBoxOnModal = () => {
    if(!editError)
      return <div></div>;
    else
      return(
        <div className='alert alert-danger alert-dismissible fade show' role="alert">
          <strong>Error </strong> ይቅርታ ሲስተሙ ችግር አጋጥሞታል። እባክዎ ደግመው ይሞክሩ።
        </div>
      );
  }

  const buildTextFields = (label, name, value, error, select, list, requeired, type) => {
    return (
      <TextField
        className={classes.textField}
        error={hasError(name)}
        fullWidth
        required={requeired}
        helperText={
          hasError(name) ? error[0] : null
        }
        label={label}
        name={name}
        onChange={handleChange}
        type={type}
        value={value || ''}
        select={select}
        SelectProps={{ native: true }}
        variant="outlined"
      >
        {list.map(option => (
          <option
            key={option.abalat_id}
            value={option.abalat_id}
          >
            {option.name}  {option.phone}
          </option>
        ))}
      </TextField>
    )
  }
  const buildTextArea = (rows, rowsMax, label, name, value, error) => {
    return (
      <TextField
        className={classes.textField}
        fullWidth
        multiline
        rows={rows}
        rowsMax={rowsMax}
        helperText={
          hasError(name) ? error[0] : null
        }
        label={label}
        name={name}
        onChange={handleChange}
        type='text'
        value={value || ''}
        variant='outlined'
      />
    )
  }

  return (
    <div>
      <IconButton 
        {...rest} 
        className={clsx(classes.root, className, classes.statusContainer)} 
        onClick={handleEditModalOpen}>
        
          <Typography display="inline" variant="body2">
            <EditIcon />
          </Typography>
        </IconButton>


        <Dialog open={openEditModal} onClose={handleEditModalClose} aria-labelledby='form-dialog-title' fullWidth={true}>
          <DialogTitle id='form-dialog-title' style={{background: '#F0F0F0'}}>
            <div style={{textAlign: 'center'}}>
              <h3>Edit </h3>
            </div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography component='span' style={{display: 'flex'}}>
                <Grid component='span' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <div style={{width: '10%'}}></div>
                  <form style={{width: '80%'}} onSubmit={editMaekel}>
                    {buildAlertBoxOnModal()}

                    {buildTextFields('የማዕከሉ ስም', 'name', formStateEdit.values.name, formStateEdit.errors.name, false, [], true )}
                    {buildTextFields('ከተማ', 'location', formStateEdit.values.location, formStateEdit.errors.location, false, [], true )}
                    {buildTextArea(3, 5, 'ተጨማሪ', 'description', formStateEdit.values.description, formStateEdit.errors.description)}
                  </form>
                </Grid>
              </Typography>
            </DialogContentText>
            <DialogActions>
              <Button 
                color="primary"
                disabled={!formStateEdit.isValid}
                size="large"
                type="submit"
                onClick={editMaekel}
              >Edit</Button>
              <Button onClick={handleEditModalClose}>Close</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
    </div>
  );
};

ChangeStatus.propTypes = {
  className: PropTypes.string,
  maekel: PropTypes.object.isRequired,
};

export default ChangeStatus;
