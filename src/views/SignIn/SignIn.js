import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import { setSessionValue, getSessionValue } from 'session';
import { Button, TextField, Typography } from '@material-ui/core';

const schema = {
  username: {
    presence: { allowEmpty: false, message: 'is required' }
    // length: {
    //   minimum: 6, maximum: 10
    // },
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' }
    // length: {
    //   minimum: 6, maximum: 10
    // }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    background: '#036',
    height: '100%'
  },
  quote: {
    display: 'flex',
    flexDirection: 'column',
    // height: '0',
    background: '#036',
    alignItems: 'center'
    // backgroundSize: 'cover',
    // backgroundRepeat: 'no-repeat',
    // backgroundPosition: 'center'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300,
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },

  logoImage: {
    width: '24%',
    paddingTop: '2%'
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center'
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 0,
    // flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    color: theme.palette.white,
    marginTop: theme.spacing(3)
  },

  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },

  cssLabel: {
    color: 'white'
  },

  cssOutlinedInput: {
    borderColor: `white !important`,
    color: `white !important`
  },

  cssFocused: {
    color: 'white !important'
  },

  notchedOutline: {
    borderWidth: '1px',
    borderColor: 'white !important',
    color: `white !important`
  }
}));

const SignIn = props => {
  const { history } = props;
  if (getSessionValue('sessionAbalatId') != '-1') {
    history.push('/dashboard');
  }
  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
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

  const [signInError, setSignInError] = useState(false);
  const [statusError, setStatusError] = useState(false);

  const handleChange = event => {
    event.persist();

    if (event.target.name === 'username')
      event.target.value = event.target.value.toLowerCase();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleSignIn = event => {
    event.preventDefault();
    
    axios
      .post(`${config.LOCATION()}account/sign-in`, { ...formState.values })
      .then(response => {
        if (response.data.abalat_id !== -1) {
          if (response.data.status === 0) setStatusError(true);
          else {
            setSessionValue('sessionName', response.data.name);
            setSessionValue('sessionAbalatId', response.data.abalat_id);
            setSessionValue('sessionUserType', response.data.user_type);
            setSessionValue('sessionMaekelId', response.data.maekel_id);
            setSessionValue('sessionMaekelName', response.data.maekel_name);
            setSessionValue('sessionKifilId', response.data.kifil_id);
            setSessionValue('sessionKifilName', response.data.kifil_name);
            history.push('/dashboard');
          }
        } else {
          setSignInError(true);
        }
      });
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const buildTextFields = (label, name, value, error, type) => {
    return (
      <TextField
        error={hasError(name)}
        fullWidth
        required={true}
        helperText={hasError(name) ? error[0] : null}
        label={label}
        name={name}
        className={classes.textField}
        value={value || ''}
        type={type}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        InputLabelProps={{
          classes: {
            root: classes.cssLabel,
            focused: classes.cssFocused
          }
        }}
        InputProps={{
          classes: {
            root: classes.cssOutlinedInput,
            focused: classes.cssFocused,
            notchedOutline: classes.notchedOutline
          }
        }}
      />
    );
  };
  const buildSubmitButton = label => {
    return (
      <Button
        disabled={!formState.isValid}
        style={{
          backgroundColor: `${formState.isValid ? '#036' : 'lightgray'}`,
          color: `${formState.isValid ? 'white' : '#036'}`,
          fontWeight: 'bold',
          width: '55%',
          border: 'white 1px solid'
        }}
        size="large"
        type="submit"
        variant="contained">
        {label}
      </Button>
    );
  };

  const buildAlertBox = (cName, header, body) => {
    return (
      <div className={cName} role="alert">
        <strong>{header}</strong> {body}
        {/* <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button> */}
      </div>
    );
  };
  const displayAlertBox = _ => {
    if (signInError)
      return buildAlertBox(
        'alert alert-danger alert-dismissible fade show',
        'Error',
        'የተጠቃሚ የይለፍ ስም ወይም/እና የይለፍ ቁጥር ተሳስቷል።'
      );
    else if (statusError)
      return buildAlertBox(
        'alert alert-danger alert-dismissible fade show',
        'Error',
        'አካውንቶዎ ለተወሰነ ጊዜ ተዘግቷል። ለበለጠ መረጃ ሀላፊዎን ያነጋግሩ።'
      );
    else return <div></div>;
  };

  return (
    <div className={classes.root}>
      <div className={classes.quote}>
        <img
          className={classes.logoImage}
          src="/images/logos/logo.png"
          alt="logo img"
        />
        <Typography
          className={classes.quoteText}
          variant="h3"
          style={{ padding: `0 3%`, textAlign: 'center' }}>
          በኢ/ኦ/ተ/ቤ/ክ በሰ/ት/ቤ/ማ/መ ማኅበረ ቅዱሳን መዝሙርና ኪነጥበባት አገልግሎት ማስተባበሪያ ክፍል የአባላት
          መረጃ ማስተዳደሪያና መቆጣጠሪያ መተግበሪያ
        </Typography>

        <Typography className={classes.title} variant="h2">
          ይግቡ / Sign In
        </Typography>
        {displayAlertBox()}

        <form className={classes.form} onSubmit={handleSignIn}>
          <Typography
            component="span"
            variant="body2"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
            {buildTextFields(
              'የተጠቃሚ የይለፍ ስም',
              'username',
              formState.values.username,
              formState.errors.username,
              'text'
            )}
            {buildTextFields(
              'የይለፍ ቁጥር',
              'password',
              formState.values.password,
              formState.errors.password,
              'password'
            )}
          </Typography>

          <Typography
            component="span"
            variant="span"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              padding: '0 3%'
            }}>
            {buildSubmitButton('ይግቡ')}
          </Typography>
        </form>
      </div>
    </div>
  );
};

SignIn.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignIn);
