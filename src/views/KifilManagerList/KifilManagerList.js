import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../../config';
import { makeStyles } from '@material-ui/styles';

import { MyToolbar, MyTable } from './components';
import { getSessionValue } from 'session';
// import mockData from './data';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const KifilManagerList = props => {
  const { history } = props;
  if(getSessionValue('sessionAbalatId') === '-1') {
    history.push('/sign-out');
  }
  const classes = useStyles();

  const [KifilManager, setKifilManager] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(function effectFunction() {
    axios.get(`${config.LOCATION()}kifil-manager/${getSessionValue('sessionMaekelId')}`)
    .then(response => {
      setKifilManager(response.data.data);
    })
  }, []);

  const onChangeValueHandler = (val) => {
    setSearchValue(val.target.value);
    updateList(val.target.value);    
  }

  const updateList = (searchValue) => {
    if(searchValue === ""){
      axios.get(`${config.LOCATION()}kifil-manager`)
      .then(response => {
        setKifilManager(response.data.data);
      })
    } else {
      axios.get(`${config.LOCATION()}search/kifil-manager/${searchValue}`)
      .then(response => {
        setKifilManager(response.data.data);
      })
    }
  }

  return (
    <div className={classes.root} >
      <MyToolbar value={searchValue} onChangeValue={onChangeValueHandler} />
      <div className={classes.content}>
        <MyTable  KifilManager={KifilManager} history={history} />
      </div>
    </div>
  );
}

export default KifilManagerList;
