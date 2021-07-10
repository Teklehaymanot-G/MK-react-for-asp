import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Button,
} from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  root: {
    width: '60%',
    height: 135,
    alignItems: 'center',
    marginTop: 15,
    minWidth: 'unset !important',
    [theme.breakpoints.down('md')]: {
      width: '80%',
    }
  },
  cardContent: {
    paddingBottom: '8px !important',
    textAlign: 'left',
    paddingLeft: '4%',
  },
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const SearchToolbar = props => {
  const { className, searchResult, onSearchResultClicked, ...rest } = props;

  const classes = useStyles();
  
  return (
    <center>
      <div
        {...rest}
        className={clsx(classes.root, className)} 
      >
          <PerfectScrollbar style={{width: '100%'}} >
            {searchResult.map(abalat => (
              <Card className={classes.inner} key={abalat.abalat_id} style={{minWidth: 'unset'}}>
                <CardContent className={
                  // eslint-disable-next-line 
                  classes.content, classes.cardContent
                }>                  
                  <Button fullWidth onClick={onSearchResultClicked} style={{display: 'flex', justifyContent: 'left'}} >
                    <span id={abalat.abalat_id}>{abalat.name}</span>
                  </Button>
              
                </CardContent>     
              </Card>
            ))}
          </PerfectScrollbar>
      </div>
    </center>
  );
};

SearchToolbar.propTypes = {
  className: PropTypes.string,
  searchResult: PropTypes.array.isRequired
};

export default SearchToolbar;
