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
  Divider,
  Typography,
} from '@material-ui/core';
import {AlertBox} from './components';
import { config } from '../../config';
import { getSessionValue } from 'session';

const schema = {
  fullName: {
    presence: { allowEmpty: false, message: 'is required'},
    length: {
      maximum: 32
    }
  },
  age: {
    presence: { allowEmpty: false, message: 'is required' },
    // length: {
    //   maximum: 2
    // }
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
    length: {maximum: 50}
  },
  yegebubetAmet: {
    // presence: { allowEmpty: true, message: 'is required' },
    length: {
      maximum: 5
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
  RegisterAbalatButton: {
    margin: theme.spacing(2, 0)
  }
}));

const RegisterAbalat = props => {
  const { history } = props;
  
  // if abal info doesn't found go to abalat list and select which abal will be edited
  if(props.location.state === undefined)
    history.push('/abalat');
  
  const abalOld = props.location.state.abal;
  

  if(getSessionValue('sessionAbalatId') === '-1') {
    history.push('/sign-out');
  }
  
  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      abalatId: abalOld.abalat_id,
      fullName: abalOld.name,
      sex: abalOld.sex,
      age: abalOld.age,
      phone: abalOld.phone,
      email: abalOld.email,
      photo: abalOld.photo,
      yegebubetAmet: abalOld.yegebubet_amet,
      maritalStatus: abalOld.marital_status,
      childrenStatus: abalOld.children_status,
      description: abalOld.description,
      modifiedBy: getSessionValue('sessionAbalatId')
    },
    touched: {},
    errors: {}
  });

  const sexOption = [
    { value: '', label: '' },
    { value: 'ወንድ', label: 'ወንድ' },
    { value: 'ሴት', label: 'ሴት' }
  ];

  const maritalStatusOption = [
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
    serverResponseFound: false
  });


  const handleChange = event => {
    event.persist();
    
    if(event.target.name === 'fullName')
      event.target.value = event.target.value.toUpperCase();

    if(event.target.name === 'email')
      event.target.value = event.target.value.toLowerCase();

      
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };


  const addAbalat = () => {
    axios.post(`${config.LOCATION()}abalat/edit`, {...formState.values})
      .then(response => {
        // console.log(response);
        setInsertResult(insertResult => ({
          ...formState.values,
          ...response.data,
          serverResponseFound: true
        }));
      });
  };

  const displayAlertBox = (_) => {
    if(insertResult.serverResponseFound){
      return(
        <AlertBox data={insertResult} />
      );
    }
  }

  const handleRegisterAbalat = event => {
    event.preventDefault();
    addAbalat();
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const buildTextFields = (label, name, value, error, select, list, requeired) => {
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
        type="text"
        value={value || ''}
        select={select}
        SelectProps={{ native: true }}
        variant="outlined"
      >
        {list.map(option => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
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
        value={value}
        variant='outlined'
      />
    )
  }
  const buildSubmitButton = (label) => {
    return (
      <Button
        className={classes.AssignGeneralManagerButton}
        color="primary"
        disabled={!formState.isValid}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
      >
        {label}
      </Button>
    )
  }
  
  return (
    <div className={classes.root}>
      <Grid
        className={classes.grid}
        container
        spacing={4}
      >
          <div>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={handleRegisterAbalat}
              >
                <Typography
                  className={classes.title}
                  variant="h2"
                >
                  አባላትን ይመዝግቡ
                </Typography>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  Use your email to create new account
                </Typography>
                
                {displayAlertBox()}

                {buildTextFields('ሙሉ ስም', 'fullName', formState.values.fullName, formState.errors.fullName, false, [], true )}
                {buildTextFields('ፆታ', 'sex', formState.values.sex, formState.errors.sex, true, sexOption, true )}
                {buildTextFields('እድሜ', 'age', formState.values.age, formState.errors.age, false, [], true )}
                {buildTextFields('ስልክ', 'phone', formState.values.phone, formState.errors.phone, false, [], true )}
                {buildTextFields('ኢሜል', 'email', formState.values.email, formState.errors.email, false, [], false )}
                {buildTextFields('የማኅበረ ቅዱሳን አባል የሆኑበት አመት', 'yegebubetAmet', formState.values.yegebubetAmet, formState.errors.yegebubetAmet, false, [], false )}
                {buildTextFields('የጋብቻ ሁኔታ', 'maritalStatus', formState.values.maritalStatus, formState.errors.maritalStatus, true, maritalStatusOption, false )}
                {buildTextFields('የልጆች ሁኔታ', 'childrenStatus', formState.values.childrenStatus, formState.errors.childrenStatus, false, [], false )}
                {buildTextArea(3, 5, 'ተጨማሪ', 'description', formState.values.description, formState.errors.description)}
                <Divider style={{height: 20}} />
                {buildSubmitButton('ያስተካክሉ')}

              </form>
            </div>
          </div>
        {/* </Grid> */}
      </Grid>
    </div>
  );
};

RegisterAbalat.propTypes = {
  history: PropTypes.object
};

export default withRouter(RegisterAbalat);
