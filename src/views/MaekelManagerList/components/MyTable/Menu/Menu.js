import React, { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  MenuItem,
  Menu,
  TextField,
} from '@material-ui/core';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import { 
  MoreVert as MoreVertIcon,
  EditOutlined as EditIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';

import Axios from 'axios';
import { config } from 'config';
import { getSessionValue } from 'session';
import validate from 'validate.js';

const schema = {
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

const MyTable = props => {
  const { mm, history } = props;

  const classes = useStyles();

  const [openTrushModal, setOpenTrushModal] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [trushError, setTrushError] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState(false);
  
  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      accountId: mm.account_id,
      password: '',
      confirmPassword: '',
      modifiedBy: getSessionValue('sessionAbalatId')
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
  }, [formState.values]);

  const handlePutDataOnTrushModal = (id) => {
    setOpenTrushModal(true);
  };
  const handleOpenChangePasswordModal = (mm) => {
    setOpenChangePasswordModal(true);
  }

  const [anchorEl, setAncorEl] = useState(false);
  const [menuItemUpdateId, setMenuItemUpdateId] = useState(-1);
  const buildMenuItems = (func, id, icon, label) => {
    return (
      <MenuItem 
        style={{paddingRight: 30, paddingLeft: 10}}
          dense={true}
          disableGutters={true}
          onClick={() => {
            func(id)
            setAncorEl(null);
          }}
        >
          {icon} &nbsp;&nbsp; {label}
      </MenuItem>
    );
  }

  const buildAlertBoxOnModal = (modal) => {
    if(!trushError && !changePasswordError)
      return <Typography component='span' style={{display: 'flex'}}></Typography>;
    else
      return(
        <Typography component='span' className='alert alert-danger alert-dismissible fade show' role="alert">
          <strong>Error </strong> ይቅርታ ሲስተሙ ችግር አጋጥሞታል። እባክዎ ደግመው ይሞክሩ።
        </Typography>
      );
  }

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const changePassword = event => {
    event.preventDefault();

    Axios.post(`${config.LOCATION()}change-password/maekel-manager`, {...formState.values})
      .then(response => {
        if(response.data.success){
          setChangePasswordError(false);
          setOpenChangePasswordModal(false);
        }
        else{
          setOpenChangePasswordModal(true);
        }
      });
  };

  const trushAbal = () => {
    const trushProps = {
      table: 'account',
      idCol: 'account_id',
      id: mm.account_id,
      trush: 1,
      modifiedBy: getSessionValue('sessionAbalatId')
    }

    Axios.post(`${config.LOCATION()}trush`, {trushProps})
      .then(response => {
        // console.log(history)
        if(response.data.success){
          // console.log(response.data)
          setTrushError(false);
          setOpenTrushModal(false);
          history.go(0);
        }
        else{
          setTrushError(true);
        }
      });
  };

  const handleChange = event => {
    event.persist();

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

  return (
    <Typography>
      <Fragment key={mm.abalat_id}>
        <IconButton
          edge='end'
          size='small'
          onClick={(e)=>{setAncorEl(e.currentTarget); setMenuItemUpdateId(mm.abalat_id)}}
          aria-label='More'
          aria-owns={anchorEl ? 'long-menu' : null}
          aria-haspopup='true'
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          id='long-menu'
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={(e)=>{setAncorEl(null);}}
        >
          {buildMenuItems(handleOpenChangePasswordModal, mm, <EditIcon />, 'የይለፍ ቁጥር ይቀይሩ')}
          {buildMenuItems(handlePutDataOnTrushModal, menuItemUpdateId, <DeleteIcon />, 'ያጥፉ')}
        </Menu>
      </Fragment>


      <Dialog open={openChangePasswordModal} onClose={() => setOpenChangePasswordModal(false)} aria-labelledby='form-dialog-title' fullWidth={true}>
        <DialogTitle id='form-dialog-title' style={{background: '#F0F0F0'}}>
          <div style={{textAlign: 'center'}}>
            <h3>የማዕከል ኃላፊ </h3>
          </div>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={changePassword}>
            <DialogContentText>                
              <Typography component='span' >
                <Grid component='span' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  {/* <div ></div> */}
                  <form onSubmit={changePassword} style={{width: '80%'}}>
                    {buildAlertBoxOnModal()}

                    {buildTextFields('የይለፍ ቁጥር', 'password', formState.values.password, formState.errors.password, false, [], true, 'password' )}
                    {buildTextFields('የይለፍ ቁጥር እንደገና ያስገቡ', 'confirmPassword', formState.values.confirmPassword, formState.errors.confirmPassword, false, [], true, 'password' )}
                  </form>
                </Grid>
              </Typography>
            </DialogContentText>
            <DialogActions>
              <Button disabled={!formState.isValid} type="submit">Change</Button>
              <Button onClick={() => setOpenChangePasswordModal(false)}>Close</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openTrushModal} onClose={() => setOpenTrushModal(false)} aria-labelledby='form-dialog-title' fullWidth={true}>
        <DialogTitle id='form-dialog-title' style={{background: '#F0F0F0'}}>
          <Typography component='center' varient='body1' >
            <h3>Trush </h3>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {buildAlertBoxOnModal()}
            
            <Typography component='span' style={{display: 'flex'}}>
              <Grid component='span' style={{display: 'flex', flexDirection: 'column'}}>
                <Typography component='span' style={{display: 'flex'}} className={classes.statusContainer}>
                  እርግጠኛ ነዎት &nbsp;
                  <Typography component='span' display="inline" variant="body2">
                    የ{ mm.name }ን
                  </Typography>&nbsp;
                  መረጃ ማጥፋት ይፈልጋሉ?
                </Typography>
              </Grid>
            </Typography>
          </DialogContentText>
          <DialogActions>
            <Button onClick={trushAbal}>ያጥፉ</Button>
            <Button onClick={() => setOpenTrushModal(false)}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
     
    </Typography>
  );
};

MyTable.propTypes = {
  className: PropTypes.string,
};

export default MyTable;