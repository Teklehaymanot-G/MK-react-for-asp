import React, { useState } from 'react';
import axios from 'axios';
import { config } from '../../config';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

import { ReportToolbar, SimpleSeachReportResult, AdvanceSeachReportResult, SearchResult } from './components';
// import mockData from './data';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const AbalatReport = () => {

  const classes = useStyles();

  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [abalatDetailInfo, setAbalatDetailInfo] = useState([]);
  
  const [toggleSearchType, setToggleSearchType] = useState('simple');

  const [hideAdvanceSearch, setHideAdvanceSearch] = useState(true);
  const [hideSimpleSearch, setHideSimpleSearch] = useState(true);
  const [advanceSearchResult, setAdvanceSearchResult] = useState([]);
  const [getMaekelAndKifilNameOnAdvanceSearch, setGetMaekelAndKifilNameOnAdvanceSearch] = useState(true)
  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      maekelId: -1,
      kifilId: -1,
      userType: '',
      sex: '',
      createdBy: -1,
      createdOn: '',
      modifiedOn: '',
    },
    check: {
      nameCheck: false,
      sexCheck: false,
      ageCheck: false,
      phoneCheck: false,
      emailCheck: false,
      photoCheck: false,
      yegebubetAmetCheck: false,
      maritalStatusCheck: false,
      childrenStatusCheck: false,
      userTypeCheck: false,
      maekelCheck: false,
      kifilCheck: false,
      selectAllCheck: false,
      selectNoneCheck: false,
      toggleSelectCheck: false,
    },
    touched: {},
    errors: {}
  });

  const advanceSearchHandler = (response) => {
    setToggleSearchType('advance')
    setAdvanceSearchResult(response);
  }


  const onChangeValueHandler = (val) => {
    setToggleSearchType('simple');
    setSearchValue(val.target.value);
    updateSearchResultList(val.target.value);    
  }

  const onSearchResultClickedHandler = (val) => {
    updateAbalatDetailInfoList(val.target.id);  
  }

  const updateSearchResultList = (searchValue) => {
    if(searchValue === ""){
      setHideSimpleSearch(true);

      axios.get(`${config.LOCATION()}abalat`)
        .then(response => {
          setSearchResult(response.data.data);
        })
    } else {
      setHideAdvanceSearch(true);
      setHideSimpleSearch(false);

      axios.get(`${config.LOCATION()}search/abalat/${searchValue}`)
        .then(response => {
          setSearchResult(response.data.data);
        })
    }
  }

  const updateAbalatDetailInfoList = (id) => {
    axios.get(`${config.LOCATION()}abalat/${id}`)
    .then(response => {
      setAbalatDetailInfo(response.data);
    })
  }

  const buildSimpleSearchResult = () => {
    if(!hideSimpleSearch)
      return <SearchResult searchResult={searchResult} onSearchResultClicked={onSearchResultClickedHandler} />
  }

  const buildResultForm = () => {
    if(toggleSearchType === 'simple')
     return (
       <Typography component='span'>
         {buildSimpleSearchResult()}        
        <Typography component={'span'} varient={'body2'} className={classes.content} >
          <SimpleSeachReportResult abalatDetailInfo={abalatDetailInfo} />
        </Typography>
      </Typography>
      );
    else if(toggleSearchType === 'advance')
      return (
        <Typography component={'span'} varient={'body2'} className={classes.content} >
          <AdvanceSeachReportResult 
            formState={formState} 
            searchResult={advanceSearchResult}
            getMaekelAndKifilNameOnAdvanceSearch={getMaekelAndKifilNameOnAdvanceSearch}
            setGetMaekelAndKifilNameOnAdvanceSearch={setGetMaekelAndKifilNameOnAdvanceSearch} />
        </Typography>
      );
    else
      return (<div></div>);
  }
  
  return (
    <div className={classes.root} >
      <ReportToolbar 
          value={searchValue} 
          onChangeValue={onChangeValueHandler} 
          formState={formState}
          setFormState={setFormState}
          advanceSearchHandler={advanceSearchHandler}
          hideAdvanceSearch={hideAdvanceSearch}
          setHideAdvanceSearch={setHideAdvanceSearch}
          setHideSimpleSearch={setHideSimpleSearch}
          setGetMaekelAndKifilNameOnAdvanceSearch={setGetMaekelAndKifilNameOnAdvanceSearch} />

      
      <Typography component={'span'} varient={'body2'} className={classes.content} >
        {buildResultForm()}
      </Typography>
    
    </div>
  );
}

export default AbalatReport;
