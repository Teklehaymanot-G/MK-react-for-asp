import React from 'react';
import PropTypes from 'prop-types';
import { getSessionValue, setSessionValue } from 'session';

const SignOut = props => {
  const { history } = props;

  setSessionValue('sessionName', '');
  setSessionValue('sessionAbalatId', -1);
  setSessionValue('sessionGmId', -1);

  history.push('/sign-in');
  
  return (
    <div>
    </div>
  );
};

SignOut.propTypes = {
  history: PropTypes.object
};

export default SignOut;
