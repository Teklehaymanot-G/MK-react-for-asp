import React from 'react';
import axios from 'axios';
import { config } from '../../../../config';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';

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
    backgroundColor: theme.palette.error.main,
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

const Abalat = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [abalatTotalCount, setAbalatTotalCount] = React.useState(0);
  const [thisPercentage, setThisPercentage] = React.useState(0);
  const [lastPercentage, setLastPercentage] = React.useState(0);
  React.useEffect(function effectFunction() {
    axios.get(`${config.LOCATION()}abalat/dashboard`)
    .then(response => {
      setAbalatTotalCount(response.data.total);
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
          classes.differenceValueLow, `${per}%`, ' ከባለፈው ወር'
        )
      )
    }
    else if(thisPercentage > 0 && lastPercentage > 0 && thisPercentage >= lastPercentage){
      per = Math.round((lastPercentage / thisPercentage) * 100);
      return (
        buildPercentageArea(
          <ArrowUpwardIcon className={classes.differenceIconHigh} />,
          classes.differenceValueHigh, `${per}%`, ' ከባለፈው ወር'
        )
      )
    }
    else if(thisPercentage > 0 && lastPercentage === 0){
      per = thisPercentage;
      return (
        buildPercentageArea(
          <ArrowUpwardIcon className={classes.differenceIconHigh} />,
          classes.differenceValueHigh, `${per}`, ' በዚህ ወር ፤ 0 ባለፈው ወር '
        )
      )
    }
    else if(thisPercentage === 0 && lastPercentage > 0){
      per = lastPercentage;
      return (
        buildPercentageArea(
          <ArrowDownwardIcon className={classes.differenceIconLow} />,
          classes.differenceValueLow, `${per}`, ' በባለፈው ወር ፤ 0 በዚህ ወር '
        )
      )
    }
    else {
      per = 0;
      return (
        buildPercentageArea(
          <div />,
          classes.differenceValueHigh, `${per}`, ' በአሁኑም ሆነ በባለፈው ወር '
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
              አባላት በአጠቃላይ
            </Typography>
            <Typography variant="h3">{ abalatTotalCount }</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <PeopleIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>

        {returnPercentage()}
        
      </CardContent>
    </Card>
  );
};

Abalat.propTypes = {
  className: PropTypes.string
};

export default Abalat;
