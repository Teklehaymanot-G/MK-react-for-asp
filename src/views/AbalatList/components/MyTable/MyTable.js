import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';
import ReactToExcel from 'react-html-table-to-excel';
import xlsx from 'xlsx';

import { getInitials } from 'helpers';
import { Menu as MenuView } from './Menu';
import { getSessionValue } from 'session';

const useStyles = makeStyles(theme => ({
  root: {},
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

const MyTable = props => {
  const { className, abalat, maekelInfo, history, ...rest } = props;
  const classes = useStyles();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);

  const handleSelectAll = event => {
    const { abalat } = props;

    let selectedUsers;

    if (event.target.checked) {
      selectedUsers = abalat.map(abal => abal.abalat_id);
    } else {
      selectedUsers = [];
    }

    setSelectedUsers(selectedUsers);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelectedUsers = [];

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }

    setSelectedUsers(newSelectedUsers);
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
    setPage(0); // start from the begining
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table id="table-to-xls">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.length === abalat.length}
                      color="primary"
                      indeterminate={
                        selectedUsers.length > 0 &&
                        selectedUsers.length < abalat.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>ስም</TableCell>
                  {getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ' ? (
                    ''
                  ) : (
                    <TableCell>የማዕከል ስም</TableCell>
                  )}
                  <TableCell>ጾታ</TableCell>
                  <TableCell>እድሜ</TableCell>
                  <TableCell>ስልክ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {abalat
                  .slice(rowsPerPage * page, rowsPerPage + rowsPerPage * page)
                  .map(abal => {
                    var reader = new FileReader();
                    var base64data = '';
                    // if (abal.photo != null) {
                    //   base64data = new Buffer(abal.photo).toString('base64');
                    // }
                    return (
                      <TableRow
                        className={classes.tableRow}
                        hover
                        key={abal.abalat_id}
                        selected={selectedUsers.indexOf(abal.abalat_id) !== -1}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              selectedUsers.indexOf(abal.abalat_id) !== -1
                            }
                            color="primary"
                            onChange={event =>
                              handleSelectOne(event, abal.abalat_id)
                            }
                            value="true"
                          />
                        </TableCell>
                        <TableCell>
                          <div className={classes.nameContainer}>
                            {/* <Avatar
                              className={classes.avatar}
                              src={'data:image/*;base64,' + base64data}>
                              {getInitials(abal.name)}
                            </Avatar> */}
                            <Typography variant="body1">{abal.name}</Typography>
                          </div>
                        </TableCell>
                        {getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ' ? (
                          ''
                        ) : (
                          <TableCell>{abal.maekel_name}</TableCell>
                        )}
                        <TableCell>{abal.sex}</TableCell>
                        <TableCell>{abal.age}</TableCell>
                        <TableCell>{abal.description}</TableCell>
                        <TableCell>
                          <MenuView
                            abal={abal}
                            abalat={abalat}
                            maekelInfo={maekelInfo}
                            history={history}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            {/* <ReactToExcel
              table="table-to-xls"
              filename="excelFile"
              sheet="sheet 1"
              buttonText="EXPORT"
            /> */}
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={abalat.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[25, 50, 100]}
        />
      </CardActions>
    </Card>
  );
};

MyTable.propTypes = {
  className: PropTypes.string,
  abalat: PropTypes.array.isRequired
};

export default MyTable;
