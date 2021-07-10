import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';

import { getSessionValue } from 'session';
import Axios from 'axios';
import { config } from 'config';
import { getInitials } from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const Profile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const user = {
    name: getSessionValue('sessionName'),
    avatar: '/images/avatars/avatar_11.png',
    userType: getSessionValue('sessionUserType'),
    maekelName: getSessionValue('sessionMaekelName'),
    kifilName: getSessionValue('sessionKifilName')
  };

  const [photo, setPhoto] = useState('');

  useEffect(function effectFunction() {
    Axios.get(
      `${config.LOCATION()}abalat/get-photo/${getSessionValue(
        'sessionAbalatId'
      )}`
    ).then(response => {
      // base64data = ;

      setPhoto(new Buffer(response.data.data[0].photo).toString('base64'));
    });
  }, []);

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        src={'data:image/*;base64,' + photo}
        to="/settings">
        {getInitials(user.name)}
      </Avatar>
      <Typography className={classes.name} variant="h4">
        {user.name}
      </Typography>
      <Typography variant="body2">{user.userType}</Typography>
      <Typography variant="body2">{user.maekelName}</Typography>
      <Typography variant="body2">{user.kifilName}</Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
