import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  CardActions,
  TablePagination } from '@material-ui/core';

import axios from 'axios';
import { config } from '../../config';

import { 
  CentersToolbar, CenterCard, } from './components';

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
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
}));

const CentersList = () => {
  const classes = useStyles();

  const [searchValue, setSearchValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [page, setPage] = useState(0);

  const [centers, setCenters] = React.useState([]);
  React.useEffect(function effectFunction() {
    if(searchValue === ""){
      axios.get(`${config.LOCATION()}centers`)
      .then(response => {
        setCenters(response.data.data);
      })
    } else {
      axios.get(`${config.LOCATION()}centers`)
      .then(response => {
        setCenters(response.data.data);
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
      axios.get(`${config.LOCATION()}centers`)
      .then(response => {
        setCenters(response.data.data);
      })
    } else {
      axios.get(`${config.LOCATION()}search/centers/${searchValue}`)
      .then(response => {
        setCenters(response.data.data);
      })
    }
  }
  
  return (
    <div className={classes.root}>
      <CentersToolbar value={searchValue} onChangeValue={onChangeValueHandler} />
      <div className={classes.content}>
        <Grid
          container
          spacing={3}
        >
          {centers.slice(rowsPerPage * page, rowsPerPage + (rowsPerPage * page)).map(center => (
            <Grid
              item
              key={center.id}
              lg={4}
              md={6}
              xs={12}
            >
              <CenterCard center={center} searchValue={searchValue} />
            </Grid>
          ))}
        </Grid>
      </div>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={centers.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[1, 2, 3]}
        />
      </CardActions>
    </div>
  );
};

export default CentersList;
