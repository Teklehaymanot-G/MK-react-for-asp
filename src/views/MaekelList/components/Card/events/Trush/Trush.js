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
import DeleteIcon from '@material-ui/icons/Delete';


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

const Trush = props => {
  const { className, maekel, history, refreashListFunc, ...rest } = props;

  const classes = useStyles();

  const [openTrushModal, setOpenTrushModal] = useState(false);
  const [trushError, setTrushError] = useState(false);
  
  const handleTrushModalOpen = () => {
    setOpenTrushModal(true);
  }
  const handleTrushModalClose = () => {
    setOpenTrushModal(false);
    console.log(openTrushModal)

  }

  const trushMaekel = () => {
    const trushProps = {
      table: 'maekel',
      idCol: 'maekel_id',
      id: maekel.maekel_id,
      trush: 1,
      modifiedBy: getSessionValue('sessionAbalatId')
    }

    // Axios.post(`${config.LOCATION()}trush`, {trushProps})
    Axios.delete(`${config.LOCATION()}maekel/${maekel.maekel_id}`)
      .then(response => {
        console.log(history)
        if(response.data.success){
          // console.log(response.data)
          setTrushError(false);
          handleTrushModalClose();
          refreashListFunc();
        }
        else{
          setTrushError(true);
        }
      });
  };

  const buildAlertBoxOnModal = (modal) => {
    if(!trushError)
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
        onClick={handleTrushModalOpen}
      >
          <Typography display="inline" variant="body2">
            <DeleteIcon />
          </Typography>      
      </IconButton>


      <Dialog open={openTrushModal} onClose={handleTrushModalClose} aria-labelledby='form-dialog-title' fullWidth={true}>
        <DialogTitle id='form-dialog-title' style={{background: '#F0F0F0'}}>
          <div style={{textAlign: 'center'}}>
            <h3>Trush </h3>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {buildAlertBoxOnModal()}
            
            <Typography component='span' style={{display: 'flex'}}>
              <Grid component='span' style={{display: 'flex', flexDirection: 'column'}}>
                <div className={classes.statusContainer}>
                  Are you sure do you want to trush &nbsp;
                  <Typography display="inline" variant="body2">
                    {maekel.name}?
                  </Typography>
                </div>
              </Grid>
            </Typography>
          </DialogContentText>
          <DialogActions>
            <Button onClick={trushMaekel}>Trush</Button>
            <Button onClick={handleTrushModalClose}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

Trush.propTypes = {
  className: PropTypes.string,
  maekel: PropTypes.object.isRequired,
  history: PropTypes.object
};

export default Trush;
