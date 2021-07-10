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
import PersonAdd from '@material-ui/icons/PersonAdd';
import { getSessionValue } from 'session';
import { config } from 'config';
import Axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
  const { className, maekel, maekelManager, abalatInfo, usernameList, history, ...rest } = props;
  const classes = useStyles();

  const username = [];
  usernameList.forEach(e => {
    username.push(e.username)
  });
  
  const schema = {
    abalatId: {
      presence: { allowEmpty: false, message: 'is required' },
      numericality: {
        onlyInteger: true,
        greaterThan: 0,
      }
    },
    username: {
      presence: { allowEmpty: false, message: 'is required' },
      length: {
        maximum: 20, minimum: 6
      },
      exclusion: {        
        within: username,
        message: '"%{value}" is already taken'
      }
    },
    password: {
      presence: { allowEmpty: false, message: 'is required' },
      length: {
        maximum: 10, minimum: 6
      },
    },
    confirmPassword: {
      presence: { allowEmpty: false, message: 'is required' },
      length: {
        maximum: 10, minimum: 6
      },
      equality: "password"
    },
  };
  
  const abalatFiltered = abalatInfo.filter(abal => abal.maekel_id === maekel.maekel_id)

  // const [mmm, setMmm] = useState([]);
  const mm = maekelManager.find((m)=>{
    // if( m.maekel_id === maekel.maekel_id){
    //   setMmm(m);
    // }

    return m.maekel_id === maekel.maekel_id;
  })
//   if(mm!==undefined)
// console.log(mmm)

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      abalatId: -1,
      maekel_id: maekel.maekel_id,
      username: '',
      password: '',
      confirmPassword: '',
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
    // username must be lower case
    if(event.target.name === 'username')
      event.target.value = event.target.value.toLowerCase();
    
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
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
  const handleAutocompleteChange = (event, name, value) => {
    event.persist();
    if(value === null)
      return;
    
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [name]: value.abalat_id,
      },
      touched: {
        ...formState.touched,
        [name]: true
      },
      errors: {
        ...formState.errors
      }
    }));
  };


  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const [mmError, setMmError] = useState(false);
  const [openMmModal, setOpenMmModal] = useState(false);  

  const handleMmModalOpen = () => {
    setOpenMmModal(true);
  }
  const handleMmModalClose = () => {
    setOpenMmModal(false);
  }

  const assignMmMaekel = event => {
    event.preventDefault();
    // console.log(formState)
    if(mm===undefined)
      var url = `${config.LOCATION()}maekel/assign`;
    else
      url = `${config.LOCATION()}maekel/update-manager/${mm.account_id}`;

    console.log(mm)
    Axios.post(url, {...formState.values})
      .then(response => {
        console.log(response);
        if(response.data.success){
          // maekel.status = maekel.status == 1 ? 0 : 1;
          setMmError(false)
          handleMmModalClose();
          history.go(0);
        }
        else{
          setMmError(true);
        }
      });
  };

  const buildAlertBoxOnModal = () => {
    if(!mmError)
      return <div></div>;
    else
      return(
        <div className='alert alert-danger alert-dismissible fade show' role="alert">
          <strong>Error </strong> ይቅርታ ሲስተሙ ችግር አጋጥሞታል። እባክዎ ደግመው ይሞክሩ።
        </div>
      );
  }
  const buildAutocomplete = (label, name, error,  multiple, required, options) => {
    return (
      <Autocomplete
        multiple={multiple}
        helperText={
          hasError(name) ? error[0] : null
        }
        name={name}
        options={options}
        getOptionLabel={option => option.name}
        onChange={(e,v)=>handleAutocompleteChange(e, 'abalatId',v)}
        renderInput={params => (
          <TextField
            {...params}
            required={required}
            variant="outlined"
            label={label}
            margin="normal"
            fullWidth
          />
        )}
      />
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
        onClick={handleMmModalOpen}>
        
          <Typography display="inline" variant="body2">
            <PersonAdd htmlColor={mm === undefined ? 'red' : 'green'} />
          </Typography>
        </IconButton>

        <Dialog open={openMmModal} onClose={handleMmModalClose} aria-labelledby='form-dialog-title' fullWidth={true}>
          <DialogTitle id='form-dialog-title' style={{background: '#F0F0F0'}}>
            <div style={{textAlign: 'center'}}>
              <h3>የማዕከል ኃላፊ </h3>
            </div>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={assignMmMaekel}>
              <DialogContentText>                
                <Typography component='span' style={{display: 'flex'}}>
                  <Grid component='span' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style={{width: '10%'}}></div>
                    <form style={{width: '80%'}} onSubmit={assignMmMaekel}>
                     { mm === undefined ? 'የማዕከል ኃላፊ አልተመደበም' : `አሁን ያለው የማዕከል ኃላፊ ስም - ${mm.name}` }
                      {buildAlertBoxOnModal()}

                      {buildAutocomplete('የአባላት ሙሉ ስም', 'abalatId', formState.errors.abalatId, false, 
                                          true, abalatFiltered )}
                      {buildTextFields('የተጠቃሚ የይለፍ ስም', 'username', formState.values.username, formState.errors.username, false, [], true, 'text' )}
                      {buildTextFields('የይለፍ ቁጥር', 'password', formState.values.password, formState.errors.password, false, [], true, 'password' )}
                      {buildTextFields('የይለፍ ቁጥር እንደገና ያስገቡ', 'confirmPassword', formState.values.confirmPassword, formState.errors.confirmPassword, false, [], true, 'password' )}
                      {buildTextArea(3, 5, 'ተጨማሪ', 'description', formState.values.description, formState.errors.description)}
                    </form>
                  </Grid>
                </Typography>
              </DialogContentText>
              <DialogActions>
                <Button 
                  disabled={!formState.isValid}
                  type="submit"
                  >Assign</Button>
                <Button onClick={handleMmModalClose}>Close</Button>
              </DialogActions>
            </form>
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
