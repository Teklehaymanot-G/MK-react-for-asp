import React, { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  MenuItem,
  Menu,
  TextField
} from '@material-ui/core';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
  MoreVert as MoreVertIcon,
  EditOutlined as EditIcon,
  Delete as DeleteIcon,
  House as HouseIcon,
  Description,
  SchoolOutlined as Room
} from '@material-ui/icons';

import Axios from 'axios';
import { config } from 'config';
import { getSessionValue } from 'session';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
  // eslint-disable-next-line
  const { abal, abalat, maekelInfo, history } = props;

  const classes = useStyles();

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openTrushModal, setOpenTrushModal] = useState(false);
  const [openAssignMaekelModal, setOpenAssignMaekelModal] = useState(false);
  const [openAssignKifilModal, setOpenAssignKifilModal] = useState(false);
  const [openAssignSubKifilModal, setOpenAssignSubKifilModal] = useState(false);
  const [putOnDetailModal, setPutOnDetailModal] = useState(undefined);
  const [trushError, setTrushError] = useState(false);
  const [assignMaekelError, setAssignMaekelError] = useState(false);
  const [assignKifilError, setAssignKifilError] = useState(false);
  const [kifilInfo, setKifilInfo] = useState([]);
  const [subKifilInfo, setSubKifilInfo] = useState([]);
  const [formStateMaekel, setFormStateMaekel] = useState({
    assignMaekel: {
      maekelId: abal.maekel_id,
      modifiedBy: getSessionValue('sessionAbalatId')
    }
  });
  const [formStateKifil, setFormStateKifil] = useState({
    assignKifil: {
      kifilId: abal.kifil_id,
      modifiedBy: getSessionValue('sessionAbalatId')
    }
  });
  const [formStateSubKifil, setFormStateSubKifil] = useState({
    assignSubKifil: {
      subKifilId: abal.sub_kifil_id,
      modifiedBy: getSessionValue('sessionAbalatId')
    }
  });

  const handlePutDataOnDetailModal = id => {
    const { abalat } = props;

    let memberDetail = [];
    memberDetail = abalat.filter(function(abal) {
      return abal.abalat_id === id;
    });

    setPutOnDetailModal(memberDetail[Object.keys(memberDetail)[0]]);
    setOpenDetailModal(true);
  };
  const handlePutDataOnTrushModal = id => {
    setOpenTrushModal(true);
  };
  const gotoEditAbalatInfoPage = abal => {
    history.push({
      pathname: '/edit-abalat-info',
      state: { abal }
    });
  };
  const handleOpenAssignMaekelModal = id => {
    setOpenAssignMaekelModal(true);
  };

  const handleOpenAssignKifilModal = id => {
    setOpenAssignKifilModal(true);
  };
  const handleOpenAssignSubKifilModal = id => {
    setOpenAssignSubKifilModal(true);
  };

  // kifil info
  useEffect(function effectFunction() {
    if (getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ') {
      const url = `${config.LOCATION()}kifil/get-by-maekel/${getSessionValue(
        'sessionMaekelId'
      )}`;
      Axios.get(url).then(response => {
        setKifilInfo(response.data.data);
      });
    }
  }, []);

  // sub kifil info
  useEffect(function effectFunction() {
    if (getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ') {
      const url = `${config.LOCATION()}sub-kifil/get-by-maekel-and-kifil`;
      const props = {
        maekelId: getSessionValue('sessionMaekelId'),
        kifilId: abal.kifil_id
      };
      Axios.post(url, { props }).then(response => {
        setSubKifilInfo(response.data.data);
      });
    }
  }, []);

  const [anchorEl, setAncorEl] = useState(false);
  const [menuItemUpdateId, setMenuItemUpdateId] = useState(-1);
  const buildMenuItems = (func, id, icon, label) => {
    return (
      <MenuItem
        style={{ paddingRight: 30, paddingLeft: 10 }}
        dense={true}
        disableGutters={true}
        onClick={() => {
          func(id);
          setAncorEl(null);
        }}>
        {icon} &nbsp;&nbsp; {label}
      </MenuItem>
    );
  };

  const buildDetailModalInfo = (label, value) => {
    return (
      <Typography component="span" style={{ fontSize: 15, display: 'flex' }}>
        <Typography component="span" variant="body2" style={{ width: '33%' }}>
          {label}
        </Typography>
        {value}
      </Typography>
    );
  };

  const buildAlertBoxOnModal = modal => {
    if (!trushError && !assignMaekelError && !assignKifilError)
      return (
        <Typography component="span" style={{ display: 'flex' }}></Typography>
      );
    else
      return (
        <Typography
          component="span"
          className="alert alert-danger alert-dismissible fade show"
          role="alert">
          <strong>Error </strong> ይቅርታ ሲስተሙ ችግር አጋጥሞታል። እባክዎ ደግመው ይሞክሩ።
        </Typography>
      );
  };

  const trushAbal = () => {
    const trushProps = {
      table: 'abalat',
      idCol: 'abalat_id',
      id: abal.abalat_id,
      trush: 1,
      modifiedBy: getSessionValue('sessionAbalatId')
    };

    Axios.post(`${config.LOCATION()}trush`, { trushProps }).then(response => {
      console.log(history);
      if (response.data.success) {
        // console.log(response.data)
        setTrushError(false);
        setOpenTrushModal(false);
        history.go(0);
      } else {
        setTrushError(true);
      }
    });
  };

  const assignMaekelForAbal = () => {
    Axios.post(`${config.LOCATION()}abalat/assign-maekel/${abal.abalat_id}`, {
      ...formStateMaekel.assignMaekel
    }).then(response => {
      console.log(history);
      if (!response.data.err) {
        setAssignMaekelError(false);
        setOpenAssignMaekelModal(false);
        // history.go(0);
      } else {
        setAssignMaekelError(true);
      }
    });
  };

  const assignKifilForAbal = () => {
    Axios.post(`${config.LOCATION()}abalat/assign-kifil/${abal.abalat_id}`, {
      ...formStateKifil.assignKifil
    }).then(response => {
      console.log(history);
      if (!response.data.err) {
        setAssignKifilError(false);
        setOpenAssignKifilModal(false);
        history.go(0);
      } else {
        setAssignKifilError(true);
      }
    });
  };

  const assignSubKifilForAbal = () => {
    Axios.post(
      `${config.LOCATION()}abalat/assign-sub-kifil/${abal.abalat_id}`,
      {
        ...formStateSubKifil.assignSubKifil
      }
    ).then(response => {
      // console.log(history);
      if (!response.data.err) {
        setAssignKifilError(false);
        setOpenAssignKifilModal(false);
        history.go(0);
      } else {
        setAssignKifilError(true);
      }
    });
  };

  const buildAutocomplete = (
    label,
    name,
    value,
    multiple,
    required,
    options
  ) => {
    return (
      <Autocomplete
        multiple={multiple}
        fullWidth
        name={name}
        options={options}
        getOptionLabel={option => option.name}
        defaultValue={maekelInfo.find(maekel => {
          if (maekel.maekel_id === abal.maekel_id) return maekel.name;
          else return '';
        })}
        onChange={(event, value) => {
          event.persist();
          setFormStateMaekel(formStateMaekel => ({
            ...formStateMaekel,
            assignMaekel: {
              ...formStateMaekel.assignMaekel,
              maekelId: value === null ? null : value.maekel_id
            }
          }));
        }}
        renderInput={params => (
          <TextField
            {...params}
            required={required}
            variant="outlined"
            label={label}
            margin="normal"
            fullWidth
          />
        )}
      />
    );
  };

  return (
    <Typography>
      <Fragment key={abal.abalat_id}>
        <IconButton
          edge="end"
          size="small"
          onClick={e => {
            setAncorEl(e.currentTarget);
            setMenuItemUpdateId(abal.abalat_id);
          }}
          aria-label="More"
          aria-owns={anchorEl ? 'long-menu' : null}
          aria-haspopup="true">
          <MoreVertIcon />
        </IconButton>

        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          // anchorOrigin={{
          //   vertical: 'top',
          //   horizontal: 'right'
          // }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={e => {
            setAncorEl(null);
          }}>
          {buildMenuItems(
            handlePutDataOnDetailModal,
            menuItemUpdateId,
            <Description />,
            'ተጨማሪ'
          )}
          {getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ'
            ? ''
            : buildMenuItems(
                gotoEditAbalatInfoPage,
                abal,
                <EditIcon />,
                'ያስተካክሉ'
              )}
          {getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ'
            ? ''
            : buildMenuItems(
                handlePutDataOnTrushModal,
                menuItemUpdateId,
                <DeleteIcon />,
                'ያጥፉ'
              )}
          {getSessionValue('sessionUserType') === 'ማስተባበሪያ ኃላፊ'
            ? buildMenuItems(
                handleOpenAssignMaekelModal,
                menuItemUpdateId,
                <HouseIcon />,
                'ማዕከል ይቀይሩ'
              )
            : ''}
          {getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ'
            ? buildMenuItems(
                handleOpenAssignKifilModal,
                menuItemUpdateId,
                <Room />,
                'ወደ ክፍል ያስገቡ'
              )
            : ''}
          {getSessionValue('sessionUserType') === 'ማዕከል ኃላፊ'
            ? buildMenuItems(
                handleOpenAssignSubKifilModal,
                menuItemUpdateId,
                <Room />,
                'ወደ ንዑስ ክፍል ያስገቡ'
              )
            : ''}
          {}
        </Menu>
      </Fragment>

      <Dialog
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        aria-labelledby="form-dialog-title"
        fullWidth={true}>
        <DialogTitle id="form-dialog-title" style={{ background: '#F0F0F0' }}>
          <Typography component="center" varient="body1">
            <h3>የአባል መረጃ</h3>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography component="span" style={{ display: 'flex' }}>
              <Typography
                component="span"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '50%'
                }}>
                {buildDetailModalInfo('ሙሉ ስም', abal.name)}
                {buildDetailModalInfo('እድሜ', abal.age)}
                {buildDetailModalInfo('ኢሜል', abal.email)}
                {buildDetailModalInfo('የጋብቻ ሁኔታ', abal.marital_status)}
              </Typography>
              <Typography
                component="span"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '50%'
                }}>
                {buildDetailModalInfo('ጾታ', abal.sex)}
                {buildDetailModalInfo('ስልክ', abal.phone)}
                {buildDetailModalInfo(
                  'የማኅበረ ቅዱሳን አባል የሆኑበት አመት',
                  abal.yegebubet_amet
                )}
                {buildDetailModalInfo('የልጆች ሁኔታ', abal.children_status)}
              </Typography>
            </Typography>
            <br />
            <Typography
              component="span"
              variant="body2"
              style={{ fontSize: 15, paddingTop: 15 }}>
              {putOnDetailModal === undefined
                ? ''
                : putOnDetailModal.description}
            </Typography>
          </DialogContentText>
          <DialogActions>
            <Button onClick={() => setOpenDetailModal(false)}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openTrushModal}
        onClose={() => setOpenTrushModal(false)}
        aria-labelledby="form-dialog-title"
        fullWidth={true}>
        <DialogTitle id="form-dialog-title" style={{ background: '#F0F0F0' }}>
          <Typography component="center" varient="body1">
            <h3>Trush </h3>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {buildAlertBoxOnModal()}
            <Typography component="span" style={{ display: 'flex' }}>
              <Grid
                component="span"
                style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  component="span"
                  style={{ display: 'flex' }}
                  className={classes.statusContainer}>
                  እርግጠኛ ነዎት &nbsp;
                  <Typography component="span" display="inline" variant="body2">
                    የ{abal.name}ን
                  </Typography>
                  &nbsp; መረጃ ማጥፋት ይፈልጋሉ?
                </Typography>
              </Grid>
            </Typography>
          </DialogContentText>
          <DialogActions>
            <Button onClick={trushAbal}>ያጥፉ</Button>
            <Button onClick={() => setOpenTrushModal(false)}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openAssignMaekelModal}
        onClose={() => setOpenAssignMaekelModal(false)}
        aria-labelledby="form-dialog-title"
        fullWidth={true}>
        <DialogTitle id="form-dialog-title" style={{ background: '#F0F0F0' }}>
          <Typography component="center" varient="body1">
            <h3>ማዕከል ይቀይሩ </h3>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {buildAlertBoxOnModal()}
            <Typography
              component="span"
              varient="span"
              style={{ display: 'flex' }}>
              {buildAutocomplete(
                'የማዕከል ስም',
                'maekelId',
                formStateMaekel.assignMaekel.maekelId,
                false,
                true,
                maekelInfo
              )}
            </Typography>
          </DialogContentText>
          <DialogActions>
            <Button onClick={assignMaekelForAbal}>ይቀይሩ</Button>
            <Button onClick={() => setOpenAssignMaekelModal(false)}>
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openAssignKifilModal}
        onClose={() => setOpenAssignKifilModal(false)}
        aria-labelledby="form-dialog-title"
        fullWidth={true}>
        <DialogTitle id="form-dialog-title" style={{ background: '#F0F0F0' }}>
          <Typography component="center" varient="body1">
            <h3>ክፍል ይቀይሩ </h3>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {buildAlertBoxOnModal()}
            <Typography
              component="span"
              varient="span"
              style={{ display: 'flex' }}>
              {/* {buildAutocomplete('የማዕከል ስም', 'kifilId', formStateKifil.assignKifil.kifilId, */}
              {/* false, true, kifilInfo )} */}
              <Autocomplete
                multiple={false}
                fullWidth
                name={'kifilId'}
                options={kifilInfo}
                getOptionLabel={option => option.name}
                defaultValue={kifilInfo.find(k => {
                  if (k.kifil_id === abal.kifil_id) return k.name;
                  else return '';
                })}
                onChange={(event, value) => {
                  event.persist();
                  setFormStateKifil(formStateKifil => ({
                    ...formStateKifil,
                    assignKifil: {
                      ...formStateKifil.assignKifil,
                      kifilId: value === null ? null : value.kifil_id
                    }
                  }));
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    required={true}
                    variant="outlined"
                    label={'የክፍል ስም'}
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            </Typography>
          </DialogContentText>
          <DialogActions>
            <Button onClick={assignKifilForAbal}>ይቀይሩ</Button>
            <Button onClick={() => setOpenAssignKifilModal(false)}>
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openAssignSubKifilModal}
        onClose={() => setOpenAssignKifilModal(false)}
        aria-labelledby="form-dialog-title"
        fullWidth={true}>
        <DialogTitle id="form-dialog-title" style={{ background: '#F0F0F0' }}>
          <Typography component="center" varient="body1">
            <h3>ንዑስ ክፍል ይቀይሩ </h3>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {buildAlertBoxOnModal()}
            <Typography
              component="span"
              varient="span"
              style={{ display: 'flex' }}>
              {kifilInfo.find(k => k.kifil_id === abal.kifil_id) ? (
                <Autocomplete
                  multiple={false}
                  fullWidth
                  name={'subKifilId'}
                  options={subKifilInfo}
                  getOptionLabel={option => option.name}
                  defaultValue={subKifilInfo.find(k => {
                    if (k.sub_kifil_id === abal.sub_kifil_id) return k.name;
                    else return '';
                  })}
                  onChange={(event, value) => {
                    event.persist();
                    setFormStateSubKifil(formStateSubKifil => ({
                      ...formStateSubKifil,
                      assignSubKifil: {
                        ...formStateSubKifil.assignSubKifil,
                        subKifilId: value === null ? null : value.sub_kifil_id
                      }
                    }));
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      required={true}
                      variant="outlined"
                      label={'የንዑስ ክፍል ስም'}
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              ) : (
                'እባክዎን በመጀመሪያ አባሉን ወደ ክፍል ያስገቡ'
              )}
            </Typography>
          </DialogContentText>
          <DialogActions>
            {kifilInfo.find(k => k.kifil_id === abal.kifil_id) ? (
              <Button onClick={assignSubKifilForAbal}>ይቀይሩ</Button>
            ) : (
              ''
            )}
            <Button onClick={() => setOpenAssignSubKifilModal(false)}>
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Typography>
  );
};

MyTable.propTypes = {
  className: PropTypes.string
};

export default MyTable;
