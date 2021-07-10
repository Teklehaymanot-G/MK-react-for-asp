import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Divider,
  CardHeader,
  IconButton
} from '@material-ui/core';

import RefreshIcon from '@material-ui/icons/Refresh';
import { ChangeStatusOfKifilManager, ChangeStatusOfKifil, Trush, Edit, AssignKifilManager } from './events';
import { getSessionValue } from 'session';
import Axios from 'axios';
import { config } from 'config';

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

const CardClass = props => {
  const { className, kifil, ...rest } = props;
  const { history } = props;

  const classes = useStyles();

  const [kifilAbalat, setKifilAbalat] = useState([])
  const [kifilManager, setKifilManager] = useState([])
  const [kifilTrushed, setKifilTrushed] = useState(false)
  
  React.useEffect(function effectFunction() {
    const props = {
      kifilId: kifil.kifil_id,
      maekelId: getSessionValue('sessionMaekelId')
    }
    Axios.post(`${config.LOCATION()}kifil-abalat-and-manager/`, {props})
    // eslint-disable-next-line
    .then(response => {
      setKifilAbalat(response.data.abalat)
      setKifilManager(response.data.manager)
    })
    // eslint-disable-next-line
  }, []);


  // username list
  const [usernameList, setUsernameList] = useState([]);
  React.useEffect(function effectFunction() {
    const props = {
      kifilId: kifil.kifil_id,
      maekelId: getSessionValue('sessionMaekelId')
    }
    Axios.get(`${config.LOCATION()}auth/get-all-usernames/`)
    // eslint-disable-next-line
    .then(response => {
      setUsernameList(response.data.data)
    })
    // eslint-disable-next-line
  }, []);
  
  const refreashKifilValues = _ => {
    const props = {
      kifilId: kifil.kifil_id,
      maekelId: getSessionValue('sessionMaekelId')
    }

    Axios.post(`${config.LOCATION()}dashboard/kifil`, {props})
    // eslint-disable-next-line
    .then(response => {
      setKifilAbalat(response.data.abalat);
      setKifilManager(response.data.manager);
      setUsernameList(response.data.usernameList);
      const trush = response.data.trush[0] !== undefined 
                        ? response.data.trush[0].trush === 1 
                            ? true
                            : false
                        : false;
      setKifilTrushed(trush)
    })
  }
  
  return (
    <Card {...rest} className={clsx(classes.root, className)} style={{display: `${kifilTrushed ? 'none' : 'inline'}`}}>
      <CardHeader
        action={
          <IconButton size="small">
            <RefreshIcon onClick={refreashKifilValues} />
          </IconButton>
        }
        title={kifil.name}
      />
      <Divider />

      <CardContent>
        <Typography align='left' variant="body1" style={{display: 'flex', justifyContent: 'space-between'}}>
          <Typography align='left' variant="body1">
            ክፍል ኃላፊ : {kifilManager[0] === undefined ? 'አልተመደበም' : kifilManager[0].name}
          </Typography>
          <ChangeStatusOfKifilManager kifilManager={kifilManager[0]} />
        </Typography>
        <Divider />
        <Typography align='left' variant="body1">
          { kifil.description }
        </Typography>
        <Divider />
        <Typography align='left' variant="body1">
          አባላት
        </Typography>
        {kifilAbalat.map((abal) => (
          <Typography component='span' varient='srOnly' style={{display: 'block'}}>{abal.name}</Typography>
        ))}
        
      </CardContent>
      <Divider />
      <CardActions>
        <Grid container justify="space-between">
          <Grid className={classes.statsItem} item>
            <ChangeStatusOfKifil kifil={kifil} />
          </Grid>
          {/* <Grid className={classes.statsItem} item>
            <Edit kifil={kifil} />
          </Grid> */}
          <Grid className={classes.statsItem} item>
            <AssignKifilManager 
                kifil={kifil} 
                kifilManager={kifilManager} 
                kifilAbalat={kifilAbalat}
                usernameList={usernameList} />
          </Grid>
          <Grid className={classes.statsItem} item>
            <Trush kifil={kifil} history={history} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

CardClass.propTypes = {
  className: PropTypes.string,
  kifil: PropTypes.object.isRequired,
  // history: PropTypes.object
  // searchValue: PropTypes.string,
};

export default CardClass;
