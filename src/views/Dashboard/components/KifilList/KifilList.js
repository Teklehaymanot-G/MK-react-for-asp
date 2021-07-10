import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, CardActions, TablePagination } from '@material-ui/core';

import axios from 'axios';
import { config } from 'config';

import { Toolbar, Card } from './components';
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
    alignItems: 'kifil',
    justifyContent: 'flex-end'
  }
}));

const KifilList = props => {
  const { history } = props;
  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [page, setPage] = useState(0);

  const [kifil, setKifil] = React.useState([]);
  const [maekelManager, setMaekelManager] = React.useState([]);
  const [abalatInfo, setAbalatInfo] = React.useState([]);
  const [usernameList, setUsernameList] = React.useState([]);

  React.useEffect(function effectFunction() {
    axios
      .get(`${config.LOCATION()}kifil/maekel-id/${getSessionValue('sessionMaekelId')}`)
      // eslint-disable-next-line
      .then(response => {
        console.log(response.data.data);
        setKifil(response.data.data);
      });
    // eslint-disable-next-line
  }, []);

  const handlePageChange = (event, page) => {
    setPage(page);
  };
  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
    setPage(0); // start from the begining
  };

  return (
    <div className={classes.root} style={{ width: '100%' }}>
      {/* <Toolbar value={searchValue} onChangeValue={onChangeValueHandler} /> */}
      <div className={classes.content}>
        <Grid container spacing={3}>
          {kifil
            .slice(rowsPerPage * page, rowsPerPage + rowsPerPage * page)
            .map(kifil => (
              <Grid item key={kifil.maekel_id ?? null} lg={4} md={6} xs={12}>
                <Card
                  kifil={kifil}
                  // maekelManager={maekelManager}
                  // abalatInfo={abalatInfo}
                  // usernameList={usernameList}
                />
              </Grid>
            ))}
        </Grid>
      </div>
      {/* <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={kifil.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[15, 30, 45]}
        />
      </CardActions> */}
    </div>
  );
};

export default KifilList;
