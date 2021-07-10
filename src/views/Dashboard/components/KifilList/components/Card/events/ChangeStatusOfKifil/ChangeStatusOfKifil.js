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
import { StatusBullet } from 'components';
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
  const { className, kifil, ...rest } = props;

  const classes = useStyles();

  const statusColors = {
    1: 'success',
    // pending: 'info',
    0: 'danger'
  };
  const statusLabel = val => {
    return val === 1 ? 'Active': 'Inactive';
  };
  
  const [openChangeStatusModal, setOpenChangeStatusModal] = useState(false);
  const [changeStatusError, setChangeStatusError] = useState(false);
  
  const handleChangeStatusModalOpen = () => {
    setOpenChangeStatusModal(true);
  }
  const handleChangeStatusModalClose = () => {
    setOpenChangeStatusModal(false);
  }

  const changeStatus = () => {
    const changeStatusProps = {
      kifilId: kifil.kifil_id,
      maekelId: getSessionValue('sessionMaekelId'),
      status: kifil.status === 1 ? 0 : 1,
      modifiedBy: getSessionValue('sessionAbalatId')
    }

    Axios.post(`${config.LOCATION()}changeStatus/maekel_kifil`, {changeStatusProps})
      .then(response => {
        if(response.data.success){
          kifil.status = kifil.status === 1 ? 0 : 1;
          setChangeStatusError(false)
          handleChangeStatusModalClose();
        }
        else{
          setChangeStatusError(true);
        }
      });
  };

  const buildAlertBoxOnModal = () => {
    if(!changeStatusError)
      return <div></div>;
    else
      return(
        <div className='alert alert-danger alert-dismissible fade show' role="alert">
          <strong>Error </strong> ይቅርታ ሲስተሙ ችግር አጋጥሞታል። እባክዎ ደግመው ይሞክሩ።
        </div>
      );
  }

  return (
    <div>
      <IconButton 
        {...rest} 
        className={clsx(classes.root, className, classes.statusContainer)} 
        onClick={handleChangeStatusModalOpen}>
        
        <StatusBullet
          className={classes.status}
          color={statusColors[kifil.status]}
          size="sm"
        />
        
        <Typography display="inline" variant="body2">
          {statusLabel(kifil.status)}
        </Typography>
      </IconButton>


      <Dialog open={openChangeStatusModal} onClose={handleChangeStatusModalClose} aria-labelledby='form-dialog-title' fullWidth={true}>
        <DialogTitle id='form-dialog-title' style={{background: '#F0F0F0'}}>
          <div style={{textAlign: 'center'}}>
            <h3>Change Status </h3>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {buildAlertBoxOnModal()}

            <Typography component='span' style={{display: 'flex'}}>
              <Grid component='span' style={{display: 'flex', flexDirection: 'column'}}>
                
                <div className={classes.statusContainer}>
                  Are you sure do you want to change status from &nbsp;&nbsp;
                  <StatusBullet
                    className={classes.status}
                    color={statusColors[kifil.status]}
                    size="sm"
                  />
                  <Typography display="inline" variant="body2">
                    {statusLabel(kifil.status)}
                  </Typography>
                  &nbsp;&nbsp; to &nbsp;&nbsp;
                  <StatusBullet
                    className={classes.status}
                    color={statusColors[kifil.status === 1 ? 0 : 1]}
                    size="sm"
                  />
                  <Typography display="inline" variant="body2">
                    {statusLabel(kifil.status === 1 ? 0 : 1)}
                  </Typography>
                </div>
              </Grid>
            </Typography>
          </DialogContentText>
          <DialogActions>
            <Button onClick={changeStatus}>Change</Button>
            <Button onClick={handleChangeStatusModalClose}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

ChangeStatus.propTypes = {
  className: PropTypes.string,
  kifil: PropTypes.object.isRequired,
};

export default ChangeStatus;
