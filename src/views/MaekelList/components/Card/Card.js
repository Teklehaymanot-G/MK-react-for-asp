import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Divider
} from '@material-ui/core';

import { ChangeStatus, Trush, Edit, AssignMaekelManager } from './events';

const useStyles = makeStyles(theme => ({
  root: {},
  imageContainer: {
    height: 64,
    width: 64,
    margin: '0 auto',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '5px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%'
  },
  statsItem: {
    display: 'flex',
    alignItems: 'center'
  },
  statsIcon: {
    color: theme.palette.icon,
    marginRight: theme.spacing(1)
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: 'unset'
  },
  status: {
    marginRight: theme.spacing(1)
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    // paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2)
  }
}));

const CardClass = props => {
  const {
    className,
    maekel,
    maekelManager,
    abalatInfo,
    usernameList,
    searchValue,
    ...rest
  } = props;
  const { history, refreashListFunc } = props;

  const classes = useStyles();

  const maekelManagerName = maekelManager.find(m => {
    return maekel.maekel_id === m.maekel_id;
  });
  // console.log()

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent>
        <Typography align="center" gutterBottom variant="h4">
          {maekel.name}
        </Typography>
        <Typography align="left" display="block" variant="body2">
          {maekel.location}
        </Typography>
        <Typography align="left" variant="body1">
          {maekel.description}
        </Typography>
        <Typography align="left" variant="body1">
          ማዕከል ኃላፊ :{' '}
          {maekelManagerName === undefined
            ? 'Not Found'
            : maekelManagerName.name}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <Grid container justify="space-between">
          <Grid className={classes.statsItem} item>
            <ChangeStatus maekel={maekel} refreashListFunc={refreashListFunc} />
          </Grid>
          <Grid className={classes.statsItem} item>
            <Edit maekel={maekel} />
          </Grid>
          <Grid className={classes.statsItem} item>
            <AssignMaekelManager
              maekel={maekel}
              maekelManager={maekelManager}
              abalatInfo={abalatInfo}
              usernameList={usernameList}
              history={history}
              refreashListFunc={refreashListFunc}
            />
          </Grid>
          <Grid className={classes.statsItem} item>
          <Trush maekel={maekel} history={history} refreashListFunc={refreashListFunc} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

CardClass.propTypes = {
  className: PropTypes.string,
  maekel: PropTypes.object.isRequired
  // history: PropTypes.object
  // searchValue: PropTypes.string,
};

export default CardClass;
