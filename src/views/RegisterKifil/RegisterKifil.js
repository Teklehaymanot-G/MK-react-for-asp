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
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import { AlertBox } from './components';
import { config } from '../../config';
import { getSessionValue } from 'session';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { RegisterKifilName } from './events';

const schema = {
  kifilId: {
    presence: { allowEmpty: false, message: 'is required' }
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

const RegisterAbalat = props => {
  const { history } = props;
  if (getSessionValue('sessionAbalatId') === '-1') {
    history.push('/sign-out');
  }

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      maekelId:
        getSessionValue('sessionUserType') === 'ማስተባበሪያ ኃላፊ'
          ? null
          : getSessionValue('sessionMaekelId'),
      kifilId: null,
      description: '',
      createdBy: getSessionValue('sessionAbalatId')
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

  const [kifilOption, setKifilOption] = useState([]);
  useEffect(() => {
    axios.get(`${config.LOCATION()}kifil/get-id-name`).then(response => {
      setKifilOption(response.data.data);
    });
  }, []);

  const [updateListRequired, setUpdateListRequired] = useState(false);
  const updateList = _ => {
    if (updateListRequired) {
      axios.get(`${config.LOCATION()}kifil/get-id-name`).then(response => {
        setKifilOption(response.data.data);
      });
      setUpdateListRequired(false);
    }
  };

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

  const addAbalat = () => {
    if (formState.isValid)
      axios
        .post(`${config.LOCATION()}maekel-kifil/add`, { ...formState.values })
        .then(response => {
          // console.log(response);
          setInsertResult(insertResult => ({
            ...formState.values,
            ...response.data,
            serverResponseFound: true
          }));
        });
  };

  const displayAlertBox = _ => {
    if (insertResult.serverResponseFound) {
      //if makeFormEmpty is true remove data form state and change makeFormEmpty to false
      if (insertResult.makeFormEmpty) {
        setFormState({
          isValid: false,
          values: {
            maekelId:
              getSessionValue('sessionUserType') === 'ማስተባበሪያ ኃላፊ'
                ? null
                : getSessionValue('sessionMaekelId'),
            kifilId: '',
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

  const handleAssignKifil = event => {
    event.preventDefault();
    addAbalat();
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

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
        name={name}
        options={options}
        getOptionLabel={option => option.name}
        // defaultValue={[top100Films[13]]}
        onChange={(event, value) => {
          event.persist();

          setFormState(formState => ({
            ...formState,
            values: {
              ...formState.values,
              [name]: value === null ? null : value.kifil_id
            },
            touched: {
              ...formState.touched,
              [name]: true
            }
          }));
        }}
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
        size="large"
        onClick={() => console.log(formState)}
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
          <form className={classes.form} onSubmit={handleAssignKifil}>
            <Typography className={classes.title} variant="h2">
              ክፍል ይመድቡ
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Use your email to create new account
            </Typography>

            <RegisterKifilName setUpdateListRequired={setUpdateListRequired} />
            {updateList()}
            {displayAlertBox()}
            {buildAutocomplete(
              'የክፍል ስም',
              'kifilId',
              formState.values.kifilId,
              formState.errors.kifilId,
              false,
              true,
              kifilOption
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
      </Grid>
    </div>
  );
};

RegisterAbalat.propTypes = {
  history: PropTypes.object
};

export default withRouter(RegisterAbalat);
