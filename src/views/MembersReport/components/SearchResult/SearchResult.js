import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Button
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '60%',
    height: 135,
    alignItems: 'center',
    marginTop: 15,
    minWidth: 'unset !important'
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

  // const [selectedUsers, setSelectedUsers] = useState([]);
  // const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [page, setPage] = useState(0);
  // const [openModal, setOpenModal] = useState(false);
  // const [putOnDetailModal, setPutOnDetailModal] = useState(undefined);

  return (
    <center>
      <div
        {...rest}
        className={clsx(classes.root, className)} 
      >
          <PerfectScrollbar style={{width: '100%'}} >
            {searchResult.map(member => (
              <Card className={classes.inner} key={member.id} style={{minWidth: 'unset'}}>
                <CardContent className={classes.content}>
                  
                  <Button onClick={onSearchResultClicked} >
                    <span id={member.id}>{member.name}</span>
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
