import React, { useState, useEffect } from 'react';
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
  Typography
} from '@material-ui/core';
import { AlertBox } from './components';
import { config } from '../../config';
import { getSessionValue } from 'session';

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 50
    }
  },
  location: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 50
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default
    // height: '100%'
  },
  grid: {
    height: '100%',
    display: 'contents'
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

const RegisterMaekel = props => {
  const { history } = props;
  if (getSessionValue('sessionAbalatId') === '-1') {
    history.push('/sign-out');
  }
  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      location: '',
      name: '',
      description: '',
      created_by: getSessionValue('sessionAbalatId')
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

  const [insertResult, setInsertResult] = useState({
    status: false,
    err: {},
    serverResponseFound: false
  });

  const handleChange = event => {
    event.persist();

    if (event.target.name === 'name')
      event.target.value = event.target.value.toUpperCase();

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

  const addMaekel = () => {
    axios
      .post(`${config.LOCATION()}maekel`, {...formState.values})
      .then(response => {
        setInsertResult(insertResult => ({
          ...formState.values,
          ...response.data,
          serverResponseFound: true
        }));
      }).catch(err=>console.log(err));
  };

  const displayAlertBox = _ => {
    if (insertResult.serverResponseFound) {
      //if makeFormEmpty is true remove data form state and change makeFormEmpty to false
      if (insertResult.makeFormEmpty) {
        setFormState({
          isValid: false,
          values: {
            location: '',
            name: '',
            description: '',
            created_by: getSessionValue('sessionAbalatId')
          },
          touched: {},
          errors: {}
        });
        setInsertResult(insertResult => ({
          ...insertResult,
          makeFormEmpty: false
        }));
      }

      return <AlertBox data={insertResult} />;
    }
  };

  const handleRegisterAbalat = event => {
    event.preventDefault();
    addMaekel(formState.values);
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const buildTextFields = (
    label,
    name,
    value,
    error,
    select,
    list,
    requeired
  ) => {
    return (
      <TextField
        className={classes.textField}
        error={hasError(name)}
        fullWidth
        required={requeired}
        helperText={hasError(name) ? error[0] : null}
        label={label}
        name={name}
        onChange={handleChange}
        type="text"
        value={value || ''}
        select={select}
        SelectProps={{ native: true }}
        variant="outlined">
        {list.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TextField>
    );
  };
  const buildTextArea = (rows, rowsMax, label, name, value, error) => {
    return (
      <TextField
        className={classes.textField}
        fullWidth
        multiline
        rows={rows}
        rowsMax={rowsMax}
        helperText={hasError(name) ? error[0] : null}
        label={label}
        name={name}
        onChange={handleChange}
        type="text"
        value={value || ''}
        variant="outlined"
      />
    );
  };
  const buildSubmitButton = label => {
    return (
      <Button
        className={classes.AssignGeneralManagerButton}
        color="primary"
        disabled={!formState.isValid}
        fullWidth
        size="large"
        type="submit"
        variant="contained">
        {label}
      </Button>
    );
  };

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container spacing={4}>
        <div>
          <div className={classes.contentBody}>
            <form className={classes.form} onSubmit={handleRegisterAbalat}>
              <Typography className={classes.title} variant="h2">
                ማዕከላትን ይመዝግቡ
              </Typography>

              {displayAlertBox()}

              {buildTextFields(
                'የማዕከሉ ስም',
                'name',
                formState.values.name,
                formState.errors.name,
                false,
                [],
                true
              )}
              {buildTextFields(
                'ከተማ',
                'location',
                formState.values.location,
                formState.errors.location,
                false,
                [],
                true
              )}
              {buildTextArea(
                3,
                5,
                'ተጨማሪ',
                'description',
                formState.values.description,
                formState.errors.description
              )}
              <Divider style={{ height: 20 }} />
              {buildSubmitButton('ይመዝግቡ')}
            </form>
          </div>
        </div>
        {/* </Grid> */}
      </Grid>
    </div>
  );
};

RegisterMaekel.propTypes = {
  history: PropTypes.object
};

export default withRouter(RegisterMaekel);
