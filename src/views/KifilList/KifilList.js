import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  CardActions,
  TablePagination } from '@material-ui/core';

import axios from 'axios';
import { config } from '../../config';

import { Toolbar, Card, } from './components';
import { getSessionValue } from 'session';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  pagination: {
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'maekel',
    justifyContent: 'flex-end'
  }
}));

const MaekelList = props => {
  const { history } = props;
  if(getSessionValue('sessionAbalatId') === '-1') {
    history.push('/sign-out');
  }
  
  const classes = useStyles();

  const [searchValue, setSearchValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [page, setPage] = useState(0);

  const [maekel, setMaekel] = React.useState([]);
  const [maekelManager, setMaekelManager] = React.useState([]);
  const [abalatInfo, setAbalatInfo] = React.useState([]);
  const [usernameList, setUsernameList] = React.useState([]);

  React.useEffect(function effectFunction() {
    if(searchValue === ""){
      axios.get(`${config.LOCATION()}kifil/${getSessionValue('sessionMaekelId')}`)
      // eslint-disable-next-line
      .then(response => {
        console.log(response)
        // setMaekel(response.data.data);
        // setMaekelManager(response.data.mm);
        // setUsernameList(response.data.usernameList);

        // add empty value to the end list 
        // response.data.abalatInfo.push({});
        // // swap the first and the last values
        // const last = response.data.abalatInfo.length - 1;
        // const temp = response.data.abalatInfo[0];
        // response.data.abalatInfo[0] = response.data.abalatInfo[last];
        // response.data.abalatInfo[last] = temp;
        // console.log(response.data.abalatInfo)
        // setAbalatInfo(response.data.abalatInfo);
      })
    } else {
      axios.get(`${config.LOCATION()}maekel`)
      .then(response => {
        setMaekel(response.data.data);
      })
    }
    // eslint-disable-next-line
  }, []);

  const handlePageChange = (event, page) => {
    setPage(page);
  };
  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
    setPage(0); // start from the begining
  };
  
  const onChangeValueHandler = (val) => {
    setSearchValue(val.target.value);
    updateList(val.target.value);    
  }

  const updateList = (searchValue) => {
    if(searchValue === ""){
      axios.get(`${config.LOCATION()}maekel`)
      .then(response => {
        setMaekel(response.data.data);
      })
    } else {
      axios.get(`${config.LOCATION()}search/maekel/${searchValue}`)
      .then(response => {
        setMaekel(response.data.data);
      })
    }
  }
  
  return (
    <div className={classes.root}>
      <Toolbar value={searchValue} onChangeValue={onChangeValueHandler} />
      <div className={classes.content}>
        <Grid
          container
          spacing={3}
        >
          {maekel.slice(rowsPerPage * page, rowsPerPage + (rowsPerPage * page)).map(maekel => (
            <Grid
              item
              key={maekel.maekel_id}
              lg={4}
              md={6}
              xs={12}
            >
              <Card 
                maekel={maekel} 
                maekelManager={maekelManager} 
                abalatInfo={abalatInfo}
                usernameList={usernameList}
                history={history} 
                searchValue={searchValue} />
            </Grid>
          ))}
        </Grid>
      </div>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={maekel.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[15, 30, 45]}
        />
      </CardActions>
    </div>
  );
};

export default MaekelList;
