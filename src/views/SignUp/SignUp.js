import React, {useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  TextField,
  FormHelperText,
  Typography,
} from '@material-ui/core';

import {AlertBox} from './components';
import { config } from '../../config';

const schema = {
  fullName: {
    presence: { allowEmpty: false, message: 'is required'},
    length: {
      maximum: 32
    }
  },
  age: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 2
    }
  },
  sex: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 3
    }
  },
  phone: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 12,
      minimum: 10
    }
  },
  email: {
    // presence: {allowEmpty: true, message: 'is required' },
    email: true,
  },
  mkMemberId: {
    // presence: { allowEmpty: true, message: 'is required' },
    length: {
      maximum: 10
    }
  },
  maritalStatus: {
    // presence: { allowEmpty: true, message: 'is required' },
    length: {
      maximum: 5
    }
  },
  familyStatus: {
    // presence: { allowEmpty: true, message: 'is required' },
    length: {
      maximum: 128
    }
  },
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    // height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    marginTop: 18,
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
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
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  }
}));

const SignUp = props => {
  // const { history } = props;
  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const sex = [
    { value: '', label: '' },
    { value: 'ወንድ', label: 'ወንድ' },
    { value: 'ሴት', label: 'ሴት' }
  ];

  const maritalStatus = [
    { value: '', label: '' },
    { value: 'ያገባ', label: 'ያገባ' },
    { value: 'ያላገባ', label: 'ያላገባ' }
  ]

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);





  const [insertResult, setInsertResult] = useState({
    status: false,
    err: {},
    firstTime: true
  });
  // useEffect(() => {
  //   setInsertResult(insertResult => ({
  //     ...insertResult,
  //   }));
  // }, [insertResult.status]);





  const handleChange = event => {
    // if(formState.values.maritalStatus === "ያገባ"){
    //   document.getElementById(this.state.maritalStatus).innerHTML = "<div>asd</div>";
    //   // console.log(formState);
    // }
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };


  const addMember = (p) => {
    if(p.fullName !== undefined && p.age !== undefined && p.sex !== undefined && p.phone !== undefined){
      if(p.email === undefined)
        p.email = "";
      if(p.photo === undefined)
        p.photo = "";
      if(p.mk_member_id === undefined)
        p.mk_member_id = "";
      if(p.marital_status === undefined)
        p.marital_status = "";
      if(p.family_status === undefined)
        p.family_status = "";

      p.created_by = 1;

      // p = JSON.stringify(p);
      axios.post(`${config.LOCATION()}members/add`, {...formState.values})
            .then(response => {
              // console.log(response);
              // console.log(response.data);
              setInsertResult(insertResult => ({
                ...formState.values,
                ...response.data,
                firstTime: false
              }));
            });
              
    }
  };

  const displayAlertBox = (_) => {
    // console.log(insertResult.firstTime);
    if(!insertResult.firstTime)
      return(
        <AlertBox data={insertResult} />
      );
  }

  const handleSignUp = event => {
    event.preventDefault();
    addMember(formState.values);
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <Grid
        className={classes.grid}
        container
        spacing={4}
      >
        {/* <Grid
          className={classes.quoteContainer}
          item
          lg={5}
        >
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography
                className={classes.quoteText}
                variant="h1"
              >
                Hella narwhal Cosby sweater McSweeney's, salvia kitsch before
                they sold out High Life.
              </Typography>
              <div className={classes.person}>
                <Typography
                  className={classes.name}
                  variant="body1"
                >
                  Takamaru Ayako
                </Typography>
                <Typography
                  className={classes.bio}
                  variant="body2"
                >
                  Manager at inVision
                </Typography>
              </div>
            </div>
          </div>
        </Grid> */}
        {/* <Grid
          className={classes.content}
          item
          lg={7}
          xs={12}
        > */}
          <div>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={handleSignUp}
              >
                <Typography
                  className={classes.title}
                  variant="h2"
                >
                  Create new account
                </Typography>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  Use your email to create new account
                </Typography>
                
                {displayAlertBox()}

                <TextField
                  className={classes.textField}
                  error={hasError('fullName')}
                  fullWidth
                  required
                  helperText={
                    hasError('fullName') ? formState.errors.fullName[0] : null
                  }
                  label="ሙሉ ስም"
                  name="fullName"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.fullName || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('age')}
                  fullWidth
                  required
                  helperText={
                    hasError('age') ? formState.errors.age[0] : null
                  }
                  label="እድሜ"
                  name="age"
                  onChange={handleChange}
                  type="number"
                  value={formState.values.age || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  fullWidth
                  required
                  label="ፆታ"
                  margin="dense"
                  name="sex"
                  onChange={handleChange}
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={formState.values.state}
                  variant="outlined"
                >
                  {sex.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
                <TextField
                  className={classes.textField}
                  error={hasError('phone')}
                  fullWidth
                  required
                  helperText={
                    hasError('phone') ? formState.errors.phone[0] : null
                  }
                  label="የስልክ ቁጥር"
                  name="phone"
                  onChange={handleChange}
                  type="phone"
                  value={formState.values.phone || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('email')}
                  fullWidth
                  helperText={
                    hasError('email') ? formState.errors.email[0] : null
                  }
                  label="የኢሜል አድራሻ"
                  name="email"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.email || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('mkMemberId')}
                  fullWidth
                  helperText={
                    hasError('mkMemberId') ? formState.errors.mkMemberId[0] : null
                  }
                  label="የማኅበረ ቅዱስን አባልነት መለያ ቁጥር"
                  name="mkMemberId"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.mkMemberId || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  fullWidth
                  label="የጋብቻ ሁኔታ"
                  margin="dense"
                  name="maritalStatus"
                  onChange={handleChange}
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={formState.values.state}
                  variant="outlined"
                >
                  {maritalStatus.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
                <TextField
                  id="familyStatusId"
                  disabled
                  className={classes.textField}
                  error={hasError('familyStatus')}
                  fullWidth
                  helperText={
                    hasError('familyStatus') ? formState.errors.familyStatus[0] : null
                  }
                  label="የቤተሰብ ሁኔታ"
                  name="familyStatus"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.familyStatus || ''}
                  variant="outlined"
                />



                {/* <div className={classes.policy}>
                  <Checkbox
                    checked={formState.values.policy || false}
                    className={classes.policyCheckbox}
                    color="primary"
                    name="policy"
                    onChange={handleChange}
                  />
                  <Typography
                    className={classes.policyText}
                    color="textSecondary"
                    variant="body1"
                  >
                    I have read the{' '}
                    <Link
                      color="primary"
                      component={RouterLink}
                      to="#"
                      underline="always"
                      variant="h6"
                    >
                      Terms and Conditions
                    </Link>
                  </Typography>
                </div> */}
                {hasError('policy') && (
                  <FormHelperText error>
                    {formState.errors.policy[0]}
                  </FormHelperText>
                )}
                <Button
                  className={classes.signUpButton}
                  color="primary"
                  disabled={!formState.isValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Sign up now
                </Button>
              </form>
            </div>
          </div>
        {/* </Grid> */}
      </Grid>
    </div>
  );
};

SignUp.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignUp);
