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

const MaekelManagerList = props => {
  const { history } = props;
  if(getSessionValue('sessionAbalatId') === '-1') {
    history.push('/sign-out');
  }
  const classes = useStyles();

  const [maekelManager, setMaekelManager] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(function effectFunction() {
    axios.get(`${config.LOCATION()}maekel-manager`)
    .then(response => {
      setMaekelManager(response.data.data);
    })
  }, []);

  const onChangeValueHandler = (val) => {
    setSearchValue(val.target.value);
    updateList(val.target.value);    
  }

  const updateList = (searchValue) => {
    if(searchValue === ""){
      axios.get(`${config.LOCATION()}maekel-manager`)
      .then(response => {
        setMaekelManager(response.data.data);
      })
    } else {
      axios.get(`${config.LOCATION()}search/maekel-manager/${searchValue}`)
      .then(response => {
        setMaekelManager(response.data.data);
      })
    }
  }

  return (
    <div className={classes.root} >
      <MyToolbar value={searchValue} onChangeValue={onChangeValueHandler} />
      <div className={classes.content}>
        <MyTable  maekelManager={maekelManager} history={history} />
      </div>
    </div>
  );
}

export default MaekelManagerList;
