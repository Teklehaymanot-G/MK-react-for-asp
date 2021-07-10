import React, { useState } from 'react';
import axios from 'axios';
import { config } from '../../config';
import { makeStyles } from '@material-ui/styles';

import { ReportToolbar, ReportResult, SearchResult } from './components';
// import mockData from './data';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const MembersReport = () => {

  const classes = useStyles();

  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [memberDetailInfo, setMemberDetailInfo] = useState([]);

  const onChangeValueHandler = (val) => {
    setSearchValue(val.target.value);
    updateSearchResultList(val.target.value);    
  }

  const onSearchResultClickedHandler = (val) => {
    updateMemberDetailInfoList(val.target.id);  
  }

  const updateSearchResultList = (searchValue) => {
    if(searchValue === ""){
      axios.get(`${config.LOCATION()}members`)
      .then(response => {
        setSearchResult(response.data.data);
      })
    } else {
      axios.get(`${config.LOCATION()}search/members/${searchValue}`)
      .then(response => {
        setSearchResult(response.data.data);
      })
    }
  }

  const updateMemberDetailInfoList = (id) => {
    axios.get(`${config.LOCATION()}member/${id}`)
    .then(response => {
      setMemberDetailInfo(response.data);
    })
  }

  return (
    <div className={classes.root} >
      <ReportToolbar value={searchValue} onChangeValue={onChangeValueHandler} />
      <SearchResult searchResult={searchResult} onSearchResultClicked={onSearchResultClickedHandler} />
      <div className={classes.content}>
        <ReportResult memberDetailInfo={memberDetailInfo} />
      </div>
    </div>
  );
}

export default MembersReport;
