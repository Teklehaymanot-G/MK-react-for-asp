import React, { useState } from 'react';
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
  CardContent } from '@material-ui/core';
import MoreVertSharp from '@material-ui/icons/MoreVertSharp';

import { SearchInput } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 25
  },
  searchGrid: {
    marginTop: theme.spacing(7)
  },
  row: {
    height: '42px',
    // display: 'flex', 
    alignItems: 'center',
    width: '60%'
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
    margin: 0,padding: 0,
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
  },
}));

const ReportToolbar = props => {
  const { className, value, onChangeValue, ...rest } = props;
  const classes = useStyles();

  const sexSelect = [
    { value: '', label: '' },
    { value: 'ወንድ', label: 'ወንድ' },
    { value: 'ሴት', label: 'ሴት' }
  ];

  const [requestData, setRequestData] = useState({
    returnData: {},
    values: {}
  })

  const [hideAdvanceSearch, setHideAdvanceSearch] = useState(true);

  const returnTextFields = (lbl, evt, val, name, select, arr) => {
    return (
      <Typography component={'span'} variant={'body2'} style={{paddingTop: 15}}>
        <TextField
          fullWidth
          label={lbl}
          name={name}
          value={val }
          onChange={(e)=> {
            e.persist();
            evt(requestData => ({
                ...requestData,
                values: {
                  ...requestData.values,
                  [name]: e.target.value
                },
                returnData: {
                  ...requestData.returnData,
                },
            }));
          }}
          type='text'
          variant='outlined'
          margin="dense"
          select={select}
          SelectProps={{ native: true }}
        >
          {arr.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
        </TextField>
      </Typography>
    )
  }
  const returnButton = () => {
    return (
      <Button
        className={classes.signUpButton}
        style={{marginTop: 2}}
        color="primary"
        fullWidth
        size="large"
        onClick={() => handleGenerateClick()}
        variant="contained"
      >
        Generate
      </Button>
    )
  }
  const buildAdvanceSearchFrom = () => {
    if(hideAdvanceSearch){
      return <span></span>
    } else {
      return (
        <Grid component={'span'} variant={'body2'} className='row' style={{width: '60%'}}>
          <Typography component={'span'} variant={'body2'} className='col-sm-6'>
            {returnTextFields('ማዕከል', setRequestData, requestData.values.sex, 'sex', true, sexSelect)}
            {returnTextFields('መረጃው የተሞላበት ቀን', setRequestData, requestData.values.createdOn, 'createdOn', false, [])}
          </Typography>
          <Typography component={'span'} variant={'body2'} className='col-sm-6'>
            {returnTextFields('መረጃው የተስተካከለበት ቀን', setRequestData, requestData.values.modifiedOn, 'modifiedOn', false, [])}
            {returnButton()}
          </Typography>
          
          <Card className={className} style={{minWidth: 'unset', width: '100%'}}>
            <CardContent>
              <Typography component='span' style={{width: '50%'}}>
                {buildAdvanceReturnDataOption('ሙሉ ስም', setRequestData, requestData.returnData.nameCheck, 'nameCheck')}   
                {buildAdvanceReturnDataOption('ጾታ', setRequestData, requestData.returnData.sexCheck, 'sexCheck')}   
              </Typography>
              <Typography component='span' style={{width: '50%'}}>
                {buildAdvanceReturnDataOption('እድሜ', setRequestData, requestData.returnData.ageCheck, 'ageCheck')}  
              </Typography>
            </CardContent>     
          </Card>
        </Grid>
      )
    }
  }
  const buildAdvanceReturnDataOption = (lbl, evt, val, name) => {
    if(hideAdvanceSearch){
      return <span></span>
    } else {
      return (
          <div className={classes.advanceReturnDataDiv}>
            <Checkbox
              checked={val || false}
              className={classes.advanceReturnDataCheckbox}
              color="primary"
              onChange={(e) => {
                evt(requestData => ({
                  ...requestData,
                  values: {
                    ...requestData.values,
                  },
                  returnData: {
                    ...requestData.returnData,
                    [name]: !val || false
                  }
                }))
              }}
            />
            <Typography
              className={classes.advanceReturnDataDivText}
              color="textSecondary"
              variant="body1"
            >
              {lbl}
            </Typography>
        </div>
      )
    }
  }
  const handleGenerateClick = () => {
    axios.post(`${config.LOCATION()}membersAdvanceReport/`, requestData)
    .then(response => {
      console.log("sad");
      console.log(response);
      return response;
    })
  }

  return (
    <Grid item
      {...rest}
      className={clsx(classes.root, className)}
    >
      <center>
        <h1>Members Report</h1>
        <p>Members information report based on different criteria.</p>
        
        <Grid item className={classes.searchGrid} style={{display: 'flex', flexDirection: 'row'}}>
          <div style={{width: '20%'}}></div>
          <div className={classes.row}>
          <SearchInput
            className={classes.searchInput}
            value={value}
            onChange={onChangeValue}
            placeholder="Search member"
            style={{paddingRight: 35,}}
          />
          
        </div>
        <IconButton 
          size="small" 
          style={{position: 'relative', top: 2, right: 45}}
          onClick={() => {
            // setRequestData(requestData => ({
            //   ...requestData,
            //   value: {
            //     ...requestData.value,
            //     modifiedOn: 'modified',
            //     createdOn: 'created'
            //   },
            //   return: {
            //     ...requestData.return,
            //     sexCheck: false,
            //     nameCheck: true
            //   },
            // }));
            setHideAdvanceSearch(!hideAdvanceSearch);
          }}
          >
            <MoreVertSharp/>
          </IconButton>
        </Grid>
        
        <Typography>
          {buildAdvanceSearchFrom()}   
        </Typography>
      </center>
    </Grid>
  );
};

ReportToolbar.propTypes = {
  className: PropTypes.string
};

export default ReportToolbar;
