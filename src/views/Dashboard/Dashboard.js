import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';

import {
  Abalat,
  Maekel,
  TasksProgress,
  TotalProfit,
  LatestSales,
  UsersByDevice,
  LatestProducts,
  LatestOrders,
  KifilList
} from './components';
import { getSessionValue } from 'session';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Dashboard = props => {
  const { history } = props;
  if (getSessionValue('sessionAbalatId') === '-1') {
    history.push('/sign-out');
  }
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          {' '}
          <Abalat /> {' '}
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          {' '}
          <Maekel />{' '}
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          {' '}
          <TasksProgress />{' '}
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          {' '}
          <TotalProfit />{' '}
        </Grid>

        {getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ' ? <KifilList /> : ''}
        <Grid item lg={8} md={12} xl={9} xs={12}>
          {' '}
          <LatestSales />{' '}
        </Grid>
        <Grid item lg={4} md={6} xl={3} xs={12}>
          {' '}
          <UsersByDevice />{' '}
        </Grid>
        <Grid item lg={4} md={6} xl={3} xs={12}>
          {' '}
          <LatestProducts />{' '}
        </Grid>
        <Grid item lg={8} md={12} xl={9} xs={12}>
          {' '}
          <LatestOrders />{' '}
        </Grid>
      </Grid>
    </div>
  );
};

Dashboard.propTypes = {
  history: PropTypes.object
};

export default Dashboard;
