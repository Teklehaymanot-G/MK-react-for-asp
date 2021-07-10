import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid
} from '@material-ui/core';
import { getSessionValue } from 'session';
import { config } from 'config';
import Axios from 'axios';
import xlsx from 'xlsx';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const ImportMenu = props => {
  const { className, refreashListFunc, ...rest } = props;
  const classes = useStyles();

  const [openImportModal, setOpenImportModal] = useState(false);
  const [importErrorMessage, setImportErrorMessage] = useState('');
  const [importError, setImportError] = useState(false);
  const [disableImportBtn, setDisableImportBtn] = useState(true);

  const [formState, setFormState] = useState({
    values: [],
    createdBy: getSessionValue('sessionAbalatId')
  });

  const buildAlertBoxOnModal = modal => {
    if (!importError) return <div></div>;
    else
      return (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert">
          <strong>Error </strong> {importErrorMessage}
        </div>
      );
  };

  const importMaekel = () => {    
    Axios.post(`${config.LOCATION()}maekel/import`, { formState }).then(
      response => {
        console.log(formState)
        console.log(response)
        if (response.data.success) {
          setImportError(false);
          setImportErrorMessage('');
          setDisableImportBtn(true);
          setFormState(formState => ({
            values: [],
            createdBy: getSessionValue('sessionAbalatId')
          }));
          setOpenImportModal(false);
          // window.location.reload();
          refreashListFunc();
        } else {
          setImportError(true);
          setImportErrorMessage(
            'There is something error in the system. Please try again.'
          );
        }
      }
    );
  };

  const importMessage = val => (
    <Typography display="block" variant="body2" style={{ paddingLeft: '5%' }}>
      {val}
    </Typography>
  );

  return (    
    <div>
      <Button
        className={classes.importButton}
        onClick={() => {
          // hide import error
          setImportError(false);
          // empty import error message
          setImportErrorMessage('');
          // disable import button
          setDisableImportBtn(true);
          // empty form state
          setFormState(formState => ({
            values: [],
            createdBy: getSessionValue('sessionAbalatId')
          }));
          // open import modal
          setOpenImportModal(true);
        }}>
        Import
      </Button>

      <Dialog
        open={openImportModal}
        onClose={() => setOpenImportModal(false)}
        aria-labelledby="form-dialog-title"
        fullWidth={true}>
        <DialogTitle id="form-dialog-title" style={{ background: '#F0F0F0' }}>
          <div style={{ textAlign: 'center' }}>
            <h3>Import </h3>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {buildAlertBoxOnModal()}

            <Typography component="span" style={{ display: 'flex' }}>
              <Grid
                component="span"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%'
                }}>
                <div className={classes.statusContainer}>
                  <Button>
                    <Link
                      style={{ color: 'red', textDecoration: 'none' }}
                      to="template/template - register maekel.xlsx"
                      target="_blank"
                      download>
                      Download
                    </Link>
                  </Button>
                  the template &nbsp;
                  {importMessage('Please only use the template')}
                  {importMessage('Do not swap columns')}
                  {importMessage('Name and Location is required')}
                  {importMessage('For status column only insert ON and Off')}
                  {importMessage(
                    'If you leave empty for status it will consider as Off'
                  )}
                  {importMessage('Do not add or remove columns')}
                  {importMessage('Do not change sheet name')}
                  {/* Load button */}
                  <Button color="primary" variant="text" component="label">
                    Load File
                    <input
                      type="file"
                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      style={{ display: 'none' }}
                      onChange={e => {

                        // hide error message
                        setImportError(false);
                        // disable import button
                        setDisableImportBtn(true);

                        // multiple file
                        if ([...e.target.files].length !== 1) return;

                        var type = [...e.target.files][0].type;
                        if (
                          type !==
                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        ) {
                          setImportError(true);
                          setImportErrorMessage(
                            'Please choose only .xlsx file.'
                          );
                          return;
                        }

                        if ([...e.target.files][0].size > 500000) {
                          setImportError(true);
                          setImportErrorMessage('File should be < 500kb.');
                          return;
                        }

                        var reader = new FileReader();
                        reader.readAsArrayBuffer([...e.target.files][0]);
                        reader.onload = function(e) {
                          var data = new Uint8Array(reader.result);
                          var wp = xlsx.read(data, { type: 'array' });
                          var ws = wp.Sheets['Sheet 1'];

                          // check sheet name
                          if (ws === undefined) {
                            setImportError(true);
                            setImportErrorMessage(
                              'Check the sheet name. It should be Sheet 1'
                            );
                            return;
                          }

                          // check sheet value is empty or not
                          var data = xlsx.utils.sheet_to_json(ws);
                          if (data.length <= 0) {
                            setImportError(true);
                            setImportErrorMessage('Sheet 1 is empty');
                            return;
                          }

                          // if description is empty insert empty
                          if(data[0].description === undefined)
                            data[0].description = '';
                          else if(data[0].status === undefined)
                            data[0].description = 0;

                          // check column names name
                          if (
                            data[0].name === undefined ||
                            data[0].location === undefined ||
                            data[0].description === undefined ||
                            data[0].status === undefined
                          ) {
                            setImportError(true);
                            setImportErrorMessage(
                              'Check the column names. It should be the same as the template'
                            );
                            console.log(data)
                            return;
                          }

                          // check every data name
                          data.forEach((element, i) => {
                            // name is requered
                            if (element.name === undefined) {
                              setImportError(true);
                              setImportErrorMessage(
                                'Column name required at row ' +
                                  (element.__rowNum__ + 1)
                              );
                              return;
                            }

                            // location is requered
                            if (element.location === undefined) {
                              setImportError(true);
                              setImportErrorMessage(
                                'Column location required at row ' +
                                  (element.__rowNum__ + 1)
                              );
                              return;
                            }

                            // status should be on, off, undefiend
                            if (
                              element.status !== undefined &&
                              !(
                                element.status.toLowerCase() === 'on' ||
                                element.status.toLowerCase() === 'off'
                              )
                            ) {
                              setImportError(true);
                              setImportErrorMessage(
                                'Column status values are only on and off'
                              );
                              return;
                            }

                            // convert status value to 1 and 0
                            if (element.status === undefined)
                              element.status = 0;
                            else if (element.status.toLowerCase() === 'off')
                              element.status = 0;
                            else if (element.status.toLowerCase() === 'on')
                              element.status = 1;

                            // convert name to upper case
                            element.name = element.name.toUpperCase();

                            // if description is empty add if
                            if (element.description === undefined)
                              element.description = '';
                          });

                          // swap order to the same
                          var swapped = JSON.parse(
                            JSON.stringify(
                              data,
                              ['name', 'location', 'description', 'status'],
                              4
                            )
                          );

                          setFormState(formState => ({
                            ...formState,
                            values: swapped
                          }));

                          // enable import button
                          setDisableImportBtn(false);
                        };
                      }}
                    />
                  </Button>
                </div>
              </Grid>
            </Typography>
          </DialogContentText>
          <DialogActions>
            <Button
              varient="contained"
              component="label"
              disabled={disableImportBtn}
              onClick={() => importMaekel()}>
              Import
            </Button>
            <Button onClick={() => setOpenImportModal(false)}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

ImportMenu.propTypes = {
  className: PropTypes.string
};

export default ImportMenu;
