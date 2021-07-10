import React from 'react';
import axios from 'axios';
import { config } from '../../../../config';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import House from '@material-ui/icons/House';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.success.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIconLow: {
    color: theme.palette.error.dark
  },
  differenceValueLow: {
    color: theme.palette.error.dark,
    marginRight: theme.spacing(1)
  },
  differenceIconHigh: {
    color: theme.palette.success.dark
  },
  differenceValueHigh: {
    color: theme.palette.success.dark,
    marginRight: theme.spacing(1)
  }
}));

const Maekel = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [maekelTotalCount, setMaekelTotalCount] = React.useState(0);
  const [thisPercentage, setThisPercentage] = React.useState(0);
  const [lastPercentage, setLastPercentage] = React.useState(0);
  React.useEffect(function effectFunction() {
    axios.get(`${config.LOCATION()}maekel/dashboard`)
    .then(response => {
      setMaekelTotalCount(response.data.total);
      setThisPercentage(response.data.this_percentage);
      setLastPercentage(response.data.last_percentage);
    })
  }, []);

  

  const buildPercentageArea = (icon, my_class, per, label) => {
    return (
      <div className={classes.difference}>
        {icon}
        <Typography
          className={my_class}
          variant="body2"
        >
          {per}
        </Typography>
        <Typography
          className={classes.caption}
          variant="caption"
        >
          {label}
        </Typography>
      </div>
    )
  }

  const returnPercentage = () => {
    var per;
    if(thisPercentage > 0 && lastPercentage > 0 && thisPercentage < lastPercentage){
      per = Math.round((thisPercentage / lastPercentage) * 100);
      return (
        buildPercentageArea(
          <ArrowDownwardIcon className={classes.differenceIconLow} />,
          classes.differenceValueLow, `${per}%`, ' ከባለፈው አመት'
        )
      )
    }
    else if(thisPercentage > 0 && lastPercentage > 0 && thisPercentage >= lastPercentage){
      per = Math.round((lastPercentage / thisPercentage) * 100);
      return (
        buildPercentageArea(
          <ArrowUpwardIcon className={classes.differenceIconHigh} />,
          classes.differenceValueHigh, `${per}%`, ' ከባለፈው አመት'
        )
      )
    }
    else if(thisPercentage > 0 && lastPercentage === 0){
      per = thisPercentage;
      return (
        buildPercentageArea(
          <ArrowUpwardIcon className={classes.differenceIconHigh} />,
          classes.differenceValueHigh, `${per}`, ' በዚህ አመት ፤ 0 ባለፈው አመት '
        )
      )
    }
    else if(thisPercentage === 0 && lastPercentage > 0){
      per = lastPercentage;
      return (
        buildPercentageArea(
          <ArrowDownwardIcon className={classes.differenceIconLow} />,
          classes.differenceValueLow, `${per}`, ' በባለፈው አመት ፤ 0 በዚህ አመት '
        )
      )
    }
    else {
      per = 0;
      return (
        buildPercentageArea(
          <div />,
          classes.differenceValueHigh, `${per}`, ' በአሁኑም ሆነ በባለፈው አመት '
        )
      )
    }
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              ማዕከላት በአጠቃላይ
            </Typography>
            <Typography variant="h3">{ maekelTotalCount }</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <House className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>

        {returnPercentage()}
      </CardContent>
    </Card>
  );
};

Maekel.propTypes = {
  className: PropTypes.string
};

export default Maekel;
