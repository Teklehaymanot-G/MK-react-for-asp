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
  Grid,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core';

import { ChangeStatus } from './events';
import { Menu as MenuView } from './Menu';

import { getInitials } from 'helpers';

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
  const { className, maekelManager, history, ...rest } = props;

  const classes = useStyles();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  // eslint-disable-next-line
  const [putOnDetailModal, setPutOnDetailModal] = useState(undefined);

  const handleSelectAll = event => {
    const { maekelManager } = props;

    let selectedUsers;

    if (event.target.checked) {
      selectedUsers = maekelManager.map(mm => mm.gm_id);
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
  

  const handleModalClose = () => {
    console.log("close modal");
    setOpenModal(false);
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.length === maekelManager.length}
                      color="primary"
                      indeterminate={
                        selectedUsers.length > 0 &&
                        selectedUsers.length < maekelManager.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>ስም</TableCell>
                  <TableCell>የማዕከል ስም</TableCell>
                  <TableCell>ስልክ</TableCell>
                  <TableCell>status</TableCell>
                  <TableCell>ዝርዝር</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {maekelManager.slice(rowsPerPage * page, rowsPerPage + (rowsPerPage * page)).map(mm => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={mm.account_id}
                    selected={selectedUsers.indexOf(mm.account_id) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.indexOf(mm.account_id) !== -1}
                        color="primary"
                        onChange={event => handleSelectOne(event, mm.account_id)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Avatar className={classes.avatar} src={mm.photo}>
                          {getInitials(mm.name)}
                        </Avatar>
                        <Typography variant="body1">{mm.name}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>{mm.maekel_name}</TableCell>
                    <TableCell>{mm.phone}</TableCell>
                    <TableCell><ChangeStatus mm={mm} /></TableCell>
                    <TableCell>{mm.description}</TableCell>
                    <TableCell>
                      <MenuView mm={mm} maekelManager={maekelManager} history={history} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={maekelManager.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[25, 50, 100]}
        />
      </CardActions>

      <Dialog open={openModal} onClose={handleModalClose} aria-labelledby='form-dialog-title' fullWidth={true}>
        <DialogTitle id='form-dialog-title' style={{background: '#F0F0F0'}}>
          <div style={{textAlign: 'center'}}>
            <h3>የአባላት መረጃ </h3>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography component='span' style={{display: 'flex'}}>
              <Grid component='span' style={{display: 'flex', flexDirection: 'column'}}>
                <span>ሙሉ ስም - {putOnDetailModal === undefined ? '' : putOnDetailModal.name}</span>
                <span>ዝርዝር - {putOnDetailModal === undefined ? '' : putOnDetailModal.description}</span>
                <span>የተመዘገበበት ቀን - {putOnDetailModal === undefined ? '' : putOnDetailModal.created_on}</span>
                <span>የተመዘገበው በ - {putOnDetailModal === undefined ? '' : putOnDetailModal.created_by}</span>
                <span>የተስተካከለበት ቀን - {putOnDetailModal === undefined ? '' : putOnDetailModal.modified_on}</span>
                <span>የተስተካከለው በ - {putOnDetailModal === undefined ? '' : putOnDetailModal.modified_by}</span>
              </Grid>
            </Typography>
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleModalClose}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

MyTable.propTypes = {
  className: PropTypes.string,
  maekelManager: PropTypes.array.isRequired
};

export default MyTable;
