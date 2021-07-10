import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../../../../config';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  IconButton,
  Typography,
  TextField,
  Button,
  Checkbox,
  Card,
  CardContent,
  FormControlLabel
} from '@material-ui/core';
import MoreVertSharp from '@material-ui/icons/MoreVertSharp';

import { SearchInput } from 'components';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 25
  },
  searchGrid: {
    marginTop: theme.spacing(7)
  },
  formContainer: {
    right: 45,
    width: '60%',
    [theme.breakpoints.down('sm')]: {
      width: '80%'
    }
  },
  formTypography: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
    // [theme.breakpoints.down('sm')]: {
    //   flexDirection: 'column'
    // },
  },
  formFields: {
    width: '48%',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  row: {
    height: '42px',
    // display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  },
  advanceReturnDataDiv: {
    // marginTop: theme.spacing(1),
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center'
  },
  advanceReturnDataCheckbox: {
    marginLeft: '-14px'
  },
  cardContent: {
    paddingBottom: '8px !important',
    textAlign: 'left',
    paddingLeft: '4%',
    display: 'flex'
  }
}));

const ReportToolbar = props => {
  const {
    className,
    value,
    onChangeValue,
    formState,
    setFormState,
    advanceSearchHandler,
    hideAdvanceSearch,
    setHideAdvanceSearch,
    setHideSimpleSearch,
    setGetMaekelAndKifilNameOnAdvanceSearch,
    ...rest
  } = props;
  const classes = useStyles();

  const [maekelOption, setMaekelOption] = useState([]);
  const [kifilOption, setKifilOption] = useState([]);
  const [abalatCreatedBy, setAbalatCreatedBy] = useState([]);

  useEffect(() => {
    axios.get(`${config.LOCATION()}maekel/get-id-name`).then(response => {
      setMaekelOption(response.data.data);
    });

    axios.get(`${config.LOCATION()}kifil/get-id-name`).then(response => {
      setKifilOption(response.data.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`${config.LOCATION()}abalat/created-by`).then(response => {
      setAbalatCreatedBy(response.data.data);
    });
  }, []);

  const sexSelect = [
    { value: '', label: '' },
    { value: 'ወንድ', label: 'ወንድ' },
    { value: 'ሴት', label: 'ሴት' }
  ];
  const userTypeSelect = [
    { value: '', label: '' },
    { value: 'ማስተባበሪያ ኃላፊ', label: 'ማስተባበሪያ ኃላፊ' },
    { value: 'ማዕከል ኃላፊ', label: 'ማዕከል ኃላፊ' },
    { value: 'ማዕከል ኃላፊ', label: 'ከፍል ኃላፊ' }
  ];

  const buildGenerateButton = () => {
    return (
      <Typography
        component={'span'}
        varient={'body1'}
        className={classes.formFields}
        style={{ marginTop: 8 }}>
        <Button
          className={classes.signUpButton}
          color="primary"
          fullWidth
          size="medium"
          onClick={() => handleGenerateClick()}
          variant="contained">
          Generate
        </Button>
      </Typography>
    );
  };
  const returnTextFields = (lbl, evt, val, name, select, arr) => {
    return (
      <Typography
        component={'div'}
        variant={'body2'}
        className={classes.formFields}>
        <TextField
          fullWidth
          label={lbl}
          name={name}
          value={val}
          onChange={e => {
            e.persist();
            evt(requestData => ({
              ...requestData,
              values: {
                ...requestData.values,
                [name]: e.target.value
              },
              check: {
                ...requestData.check
              }
            }));
          }}
          type="text"
          variant="outlined"
          margin="dense"
          select={select}
          SelectProps={{ native: true }}>
          {arr.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </Typography>
    );
  };
  const buildAutocomplete = (
    label,
    name,
    evt,
    value,
    multiple,
    required,
    options
  ) => {
    return (
      <Typography
        component={'div'}
        variant={'body2'}
        className={classes.formFields}>
        <Autocomplete
          multiple={multiple}
          name={name}
          options={options}
          getOptionLabel={option => option.name}
          // defaultValue={[top100Films[13]]}
          onChange={(e, v) => {
            e.persist();
            console.log(formState);
            evt(requestData => ({
              ...requestData,
              values: {
                ...requestData.values,
                [name]:
                  v === null
                    ? -1
                    : name === 'maekelId'
                    ? v.maekel_id
                    : name === 'kifilId'
                    ? v.kifil_id
                    : v.abalat_id
              },
              check: {
                ...requestData.check
              }
            }));
          }}
          renderInput={params => (
            <TextField
              {...params}
              required={required}
              label={label}
              variant="outlined"
              margin="dense"
              // fullWidth
            />
          )}
        />
      </Typography>
    );
  };
  const buildAdvanceCheckOption = (lbl, evt, val, name) => {
    if (hideAdvanceSearch) {
      return <span></span>;
    } else {
      return (
        <Typography className={classes.advanceReturnDataDiv}>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label={lbl}
            checked={val || false}
            onChange={e => {
              if (
                name === 'toggleSelectCheck' ||
                name === 'selectAllCheck' ||
                name === 'selectNoneCheck'
              ) {
                evt(requestData => ({
                  ...requestData,
                  values: {
                    ...requestData.values
                  },
                  check: {
                    ...requestData.check,
                    nameCheck:
                      name === 'toggleSelectCheck'
                        ? !requestData.check.nameCheck
                        : name === 'selectAllCheck'
                        ? true
                        : false,
                    sexCheck:
                      name === 'toggleSelectCheck'
                        ? !requestData.check.sexCheck
                        : name === 'selectAllCheck'
                        ? true
                        : false,
                    ageCheck:
                      name === 'toggleSelectCheck'
                        ? !requestData.check.ageCheck
                        : name === 'selectAllCheck'
                        ? true
                        : false,
                    phoneCheck:
                      name === 'toggleSelectCheck'
                        ? !requestData.check.phoneCheck
                        : name === 'selectAllCheck'
                        ? true
                        : false,
                    emailCheck:
                      name === 'toggleSelectCheck'
                        ? !requestData.check.emailCheck
                        : name === 'selectAllCheck'
                        ? true
                        : false,
                    photoCheck:
                      name === 'toggleSelectCheck'
                        ? !requestData.check.photoCheck
                        : name === 'selectAllCheck'
                        ? true
                        : false,
                    yegebubetAmetCheck:
                      name === 'toggleSelectCheck'
                        ? !requestData.check.yegebubetAmetCheck
                        : name === 'selectAllCheck'
                        ? true
                        : false,
                    maritalStatusCheck:
                      name === 'toggleSelectCheck'
                        ? !requestData.check.maritalStatusCheck
                        : name === 'selectAllCheck'
                        ? true
                        : false,
                    childrenStatusCheck:
                      name === 'toggleSelectCheck'
                        ? !requestData.check.childrenStatusCheck
                        : name === 'selectAllCheck'
                        ? true
                        : false,
                    userTypeCheck:
                      name === 'toggleSelectCheck'
                        ? !requestData.check.userTypeCheck
                        : name === 'selectAllCheck'
                        ? true
                        : false,
                    maekelCheck:
                      name === 'toggleSelectCheck'
                        ? !requestData.check.maekelCheck
                        : name === 'selectAllCheck'
                        ? true
                        : false,
                    kifilCheck:
                      name === 'toggleSelectCheck'
                        ? !requestData.check.kifilCheck
                        : name === 'selectAllCheck'
                        ? true
                        : false,
                    selectAllCheck:
                      name === 'toggleSelectCheck'
                        ? false
                        : name === 'selectAllCheck'
                        ? true
                        : false,
                    selectNoneCheck:
                      name === 'toggleSelectCheck'
                        ? false
                        : name === 'selectAllCheck'
                        ? false
                        : true,
                    toggleSelectCheck:
                      name === 'toggleSelectCheck'
                        ? !requestData.check.toggleSelectCheck
                        : name === 'selectAllCheck'
                        ? true
                        : false
                  }
                }));
              } else {
                evt(requestData => ({
                  ...requestData,
                  values: {
                    ...requestData.values
                  },
                  check: {
                    ...requestData.check,
                    [name]: !val || false
                  }
                }));
              }
            }}
          />
        </Typography>
      );
    }
  };
  const buildAdvanceSearchForm = () => {
    if (hideAdvanceSearch) {
      return <span></span>;
    } else {
      return (
        <Grid component={'span'} variant={'body2'}>
          <Typography
            component={'span'}
            variant={'body2'}
            className={classes.formTypography}>
            {buildAutocomplete(
              'የማዕከል ስም',
              'maekelId',
              setFormState,
              formState.values.maekelId,
              false,
              false,
              maekelOption
            )}
            {buildAutocomplete(
              'የክፍል ስም',
              'kifilId',
              setFormState,
              formState.values.kifilId,
              false,
              false,
              kifilOption
            )}
            {returnTextFields(
              'የአካውንት አይነት',
              setFormState,
              formState.values.userType,
              'userType',
              true,
              userTypeSelect
            )}
          </Typography>
          <Typography
            component={'span'}
            variant={'body2'}
            className={classes.formTypography}>
            {returnTextFields(
              'ፆታ',
              setFormState,
              formState.values.sex,
              'sex',
              true,
              sexSelect
            )}
            {buildAutocomplete(
              'መረጃው የመዘገበው በ',
              'createdBy',
              setFormState,
              formState.values.createdBy,
              false,
              false,
              abalatCreatedBy
            )}
          </Typography>
          <Typography
            component={'span'}
            variant={'body2'}
            className={classes.formTypography}>
            {returnTextFields(
              'መረጃው የተሞላበት ቀን',
              setFormState,
              formState.values.createdOn,
              'createdOn',
              false,
              []
            )}
            {returnTextFields(
              'መረጃው የተስተካከለበት ቀን',
              setFormState,
              formState.values.modifiedOn,
              'modifiedOn',
              false,
              []
            )}
          </Typography>

          <Card
            className={className}
            style={{ minWidth: 'unset', width: '100%' }}>
            <CardContent>
              <Typography
                component={'span'}
                variant={'body2'}
                className={classes.formTypography}>
                <Typography component={'span'} variant={'body2'}>
                  {buildAdvanceCheckOption(
                    'ሙሉ ስም',
                    setFormState,
                    formState.check.nameCheck,
                    'nameCheck'
                  )}
                  {buildAdvanceCheckOption(
                    'ስልክ',
                    setFormState,
                    formState.check.phoneCheck,
                    'phoneCheck'
                  )}
                  {buildAdvanceCheckOption(
                    'አባል የሆኑበት አመት',
                    setFormState,
                    formState.check.yegebubetAmetCheck,
                    'yegebubetAmetCheck'
                  )}
                  {buildAdvanceCheckOption(
                    'የአካውንት አይነት',
                    setFormState,
                    formState.check.userTypeCheck,
                    'userTypeCheck'
                  )}
                  {buildAdvanceCheckOption(
                    'ሁሉንም ምረጥ',
                    setFormState,
                    formState.check.selectAllCheck,
                    'selectAllCheck'
                  )}
                </Typography>
                <Typography component={'span'} variant={'body2'}>
                  {buildAdvanceCheckOption(
                    'ጾታ',
                    setFormState,
                    formState.check.sexCheck,
                    'sexCheck'
                  )}
                  {buildAdvanceCheckOption(
                    'ኢሜል',
                    setFormState,
                    formState.check.emailCheck,
                    'emailCheck'
                  )}
                  {buildAdvanceCheckOption(
                    'የቤተሰብ ሁኔታ',
                    setFormState,
                    formState.check.maritalStatusCheck,
                    'maritalStatusCheck'
                  )}
                  {buildAdvanceCheckOption(
                    'የማዕከል ስም',
                    setFormState,
                    formState.check.maekelCheck,
                    'maekelCheck'
                  )}
                  {buildAdvanceCheckOption(
                    'ምንም ምረጥ',
                    setFormState,
                    formState.check.selectNoneCheck,
                    'selectNoneCheck'
                  )}
                </Typography>
                <Typography component={'span'} variant={'body2'}>
                  {buildAdvanceCheckOption(
                    'እድሜ',
                    setFormState,
                    formState.check.ageCheck,
                    'ageCheck'
                  )}
                  {buildAdvanceCheckOption(
                    'ፎቶ',
                    setFormState,
                    formState.check.photoCheck,
                    'photoCheck'
                  )}
                  {buildAdvanceCheckOption(
                    'የልጆች ሁኔታ',
                    setFormState,
                    formState.check.childrenStatusCheck,
                    'childrenStatusCheck'
                  )}
                  {buildAdvanceCheckOption(
                    'የክፍል ስም',
                    setFormState,
                    formState.check.kifilCheck,
                    'kifilCheck'
                  )}
                  {buildAdvanceCheckOption(
                    'ምርጫ ቀይር',
                    setFormState,
                    formState.check.toggleSelectCheck,
                    'toggleSelectCheck'
                  )}
                </Typography>
              </Typography>
            </CardContent>
          </Card>

          <Typography
            component={'span'}
            variant={'body2'}
            style={{ justifyContent: 'center' }}
            className={classes.formTypography}>
            {buildGenerateButton()}
          </Typography>
        </Grid>
      );
    }
  };
  const handleGenerateClick = () => {
    if (
      formState.values.maekelId === -1 &&
      formState.values.userType === '' &&
      formState.values.sex === '' &&
      formState.values.createdBy === '' &&
      formState.values.createdOn === '' &&
      formState.values.modifiedOn === ''
    ) {
      return;
    } else if (
      !formState.check.nameCheck &&
      !formState.check.sexCheck &&
      !formState.check.ageCheck &&
      !formState.check.phoneCheck &&
      !formState.check.emailCheck &&
      !formState.check.photoCheck &&
      !formState.check.yegebubetAmetCheck &&
      !formState.check.maritalStatusCheck &&
      !formState.check.userTypeCheck &&
      !formState.check.maekelCheck &&
      !formState.check.childrenStatusCheck
    ) {
      return;
    }

    axios
      .post(`${config.LOCATION()}abalat/advance-report/`, formState)
      .then(response => {
        advanceSearchHandler(response.data.data);
        console.log(response.data);
        // always when generate button is clicked it will find maekel and kifil name from database
        // and set setGetMaekelAndKifilNameOnAdvanceSearch to false to stop lopping
        setGetMaekelAndKifilNameOnAdvanceSearch(true);
      });
  };

  return (
    <Grid
      item
      {...rest}
      className={clsx(classes.root, className)}
      style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
      <Typography component={'div'} className={classes.formContainer}>
        <Typography component={'center'}>
          <h1 component={'h1'} varient={'h1'}>
            የአባላት ሪፖርት
          </h1>
          <p component={'p'} varient={'p'}>
            Abalat information report based on different criteria.
          </p>
        </Typography>

        <Grid
          item
          className={classes.searchGrid}
          style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography component={'div'} className={classes.row}>
            <SearchInput
              className={classes.searchInput}
              value={value}
              onChange={onChangeValue}
              placeholder="Search abalat"
              style={{ paddingRight: 35 }}
            />
          </Typography>
          <IconButton
            size="small"
            style={{ position: 'relative', top: 2, right: 45 }}
            onClick={() => {
              setHideAdvanceSearch(!hideAdvanceSearch);
              setHideSimpleSearch(true);
            }}>
            <MoreVertSharp />
          </IconButton>
        </Grid>

        <Typography component={'span'} varient={'body1'}>
          {buildAdvanceSearchForm()}
        </Typography>
      </Typography>
    </Grid>
  );
};

ReportToolbar.propTypes = {
  className: PropTypes.string
};

export default ReportToolbar;
