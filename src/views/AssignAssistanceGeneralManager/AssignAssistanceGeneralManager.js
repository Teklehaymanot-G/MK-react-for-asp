import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import axios from 'axios';
import { config } from '../../config';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  TextField,
  Typography,
  Divider
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { AlertBox } from './components';
import { getSessionValue } from 'session';

const schema = {
  abalat_id: {
    // presence: { allowEmpty: false, message: 'is required'},
    length: {
      minimum: 1
    }
  },
  username: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 10,
      minimum: 6
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 10,
      minimum: 6
    }
  },
  confirmPassword: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 10,
      minimum: 6
    },
    equality: 'password'
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.down('md')]: {
      // width: '90%',
    }
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
  AssignGeneralManagerButton: {
    margin: theme.spacing(2, 0)
  }
}));

const AssignGeneralManager = props => {
  const { history } = props;
  if (getSessionValue('sessionAbalatId') === '-1') {
    history.push('/sign-out');
  }
  const classes = useStyles();

  // const [disableChildrenStatus, setDisableChildrenStatus] = useState(true);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      abalatId: -1,
      username: '',
      password: '',
      description: '',
      createdBy: getSessionValue('sessionAbalatId')
    },
    touched: {},
    errors: {}
  });

  const [abalatOption, setAbalatOption] = useState([]);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  useEffect(() => {
    axios
      .get(`${config.LOCATION()}abalat/general-manager/get-id-name`)
      .then(response => {
        setAbalatOption(response.data.data);
      });
  }, []);

  const [insertResult, setInsertResult] = useState({
    status: false,
    err: {},
    serverResponseFound: false
  });

  const handleChange = event => {
    event.persist();
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
  const handleAutocompleteChange = (event, name, value) => {
    event.persist();
    if (value === null) return;

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [name]: value.abalat_id
      },
      touched: {
        ...formState.touched,
        [name]: true
      }
    }));
  };

  const handleAssignGeneralManager = event => {
    event.preventDefault();
    addGeneralManager();
  };
  const addGeneralManager = () => {
    console.log(formState);
    axios
      .post(`${config.LOCATION()}general-manager/assistance/assign`, {
        ...formState.values
      })
      .then(response => {
        console.log(response);
        setInsertResult(insertResult => ({
          ...formState.values,
          ...response.data,
          serverResponseFound: true
        }));
      });
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const displayAlertBox = _ => {
    if (insertResult.serverResponseFound) {
      //if makeFormEmpty is true remove data form state and change makeFormEmpty to false
      if (insertResult.makeFormEmpty) {
        setFormState({
          isValid: false,
          values: {
            abalatId: -1,
            username: '',
            password: '',
            description: '',
            createdBy: getSessionValue('sessionAbalatId')
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
  const buildTextFields = (
    label,
    name,
    value,
    error,
    select,
    list,
    requeired,
    type
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
        type={type}
        value={value || ''}
        select={select}
        SelectProps={{ native: true }}
        variant="outlined"
        // disabled={
        //   // disable only chilfdren status based on marital status value
        //   name==='childrenStatus'
        //     ? disableChildrenStatus
        //     : false
        // }
      >
        {list.map(option => (
          <option key={option.abalat_id} value={option.abalat_id}>
            {option.name}
            {option.phone}
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
  const buildAutocomplete = (
    label,
    name,
    value,
    error,
    multiple,
    required,
    options
  ) => {
    return (
      <Autocomplete
        multiple={multiple}
        // helperText={
        //   hasError(name) ? error[0] : null
        // }
        name={name}
        options={options}
        getOptionLabel={option => option.name}
        // defaultValue={[top100Films[13]]}
        onChange={(e, v) => handleAutocompleteChange(e, 'abalatId', v)}
        renderInput={params => (
          <TextField
            {...params}
            required={required}
            variant="outlined"
            label={label}
            margin="normal"
            fullWidth
          />
        )}
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
        onChange={handleChange}
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
        <div className={classes.contentBody}>
          <form className={classes.form} onSubmit={handleAssignGeneralManager}>
            <Typography className={classes.title} variant="h2">
              የማስተባበሪያ ምክትል ኃላፊ ይመድቡ
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              <Divider />
            </Typography>

            {displayAlertBox()}

            {buildAutocomplete(
              'የአባላት ሙሉ ስም',
              'abalatId',
              formState.values.abalatId,
              formState.errors.abalatId,
              false,
              true,
              abalatOption
            )}
            {buildTextFields(
              'የተጠቃሚ የይለፍ ስም',
              'username',
              formState.values.username,
              formState.errors.username,
              false,
              [],
              true,
              'text'
            )}
            {buildTextFields(
              'የይለፍ ቁጥር',
              'password',
              formState.values.password,
              formState.errors.password,
              false,
              [],
              true,
              'password'
            )}
            {buildTextFields(
              'የይለፍ ቁጥር እንደገና ያስገቡ',
              'confirmPassword',
              formState.values.confirmPassword,
              formState.errors.confirmPassword,
              false,
              [],
              true,
              'password'
            )}
            {buildTextArea(
              3,
              5,
              'ተጨማሪ',
              'description',
              formState.values.description,
              formState.errors.description
            )}
            {buildSubmitButton('ይመድቡ')}
          </form>
        </div>
        {/* </Grid> */}
      </Grid>
    </div>
  );
};

AssignGeneralManager.propTypes = {
  history: PropTypes.object
};

export default withRouter(AssignGeneralManager);
