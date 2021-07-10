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

const AbalatList = props => {
  const { history } = props;
  if (getSessionValue('sessionAbalatId') === '-1') {
    history.push('/sign-out');
  }
  const classes = useStyles();

  const [abalat, setAbalat] = useState([]);
  const [maekelInfo, setMaekelInfo] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(function effectFunction() {
    if (
      getSessionValue('sessionUserType') === 'ማስተባበሪያ ኃላፊ' ||
      getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ'
    ) 
    {
      // display all abalat for ማስተባበሪያ ኃላፊ
      var url = `${config.LOCATION()}abalat`;

      // display all abalat for ማዕከል ኃላፊ
      if (getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ')
        url = `${config.LOCATION()}abalat/get-by-maekel/${getSessionValue(
          'sessionMaekelId'
        )}`;

      axios.get(url).then(response => {
        setAbalat(response.data.data);
        setMaekelInfo(response.data.maekelInfo);
      });
    } 
    else if (getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ') {
      const params = {
        maekelId: getSessionValue('sessionMaekelId'),
        kifilId: getSessionValue('sessionKifilId')
      };

      axios
        .post(`${config.LOCATION()}abalat/get-by-kifil`, params)
        .then(response => {
          // console.log(response);
          setAbalat(response.data.data);
        });
    }
  }, []);

  const onChangeValueHandler = val => {
    setSearchValue(val.target.value);
    updateList(val.target.value);
  };

  // update list when a user searches abalat
  const updateList = searchValue => {
    // if search field is empty 
    if (searchValue === '') 
    {
      if (
        getSessionValue('sessionUserType') === 'ማስተባበሪያ ኃላፊ' ||
        getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ'
      ) 
      {
        var url = `${config.LOCATION()}abalat`;
        if (getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ')
          url = `${config.LOCATION()}abalat/get-by-maekel/${getSessionValue(
            'sessionMaekelId'
          )}`;

        axios.get(url).then(response => {
          setAbalat(response.data.data);
          setMaekelInfo(response.data.maekelInfo);
        });
      } else if (getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ') {
        const params = {
          maekelId: getSessionValue('sessionMaekelId'),
          kifilId: getSessionValue('sessionKifilId')
        };
        axios
          .post(`${config.LOCATION()}abalat/get-by-kifil`, params)
          .then(response => {
            // console.log(response);
            setAbalat(response.data.data);
          });
      }
    }
    // if search field is not empty 
    else {
      if (
        getSessionValue('sessionUserType') === 'ማስተባበሪያ ኃላፊ' ||
        getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ'
      ) 
      {
        // search abalat for ማስተባበሪያ ኃላፊ
        url = `${config.LOCATION()}abalat/search`;

        // search abalat for ማዕከል ኃላፊ
        if (getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ')
          url = `${config.LOCATION()}search/abalat/get-by-maekel`;

        axios.post(url, {
            searchValue,
            maekelId: getSessionValue('sessionMaekelId')
          })
          .then(response => {
            setAbalat(response.data);
          });
      } else if (getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ') {
        const params = {
          maekelId: getSessionValue('sessionMaekelId'),
          kifilId: getSessionValue('sessionKifilId'),
          searchValue
        };
        axios
          .post(`${config.LOCATION()}search/abalat/get-by-kifil`, params)
          .then(response => {
            setAbalat(response.data.data);
          });
      }
    }
  };

  return (
    <div className={classes.root}>
      <MyToolbar
        value={searchValue}
        maekelInfo={maekelInfo}
        onChangeValue={onChangeValueHandler}
        setAbalat={setAbalat}
        abalat={abalat}
      />
      <div className={classes.content}>
        <MyTable abalat={abalat} maekelInfo={maekelInfo} history={history} />
      </div>
    </div>
  );
};

export default AbalatList;
