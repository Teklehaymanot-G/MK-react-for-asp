import React, { useState } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { config } from '../../../../config';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
} from '@material-ui/core';

import { formatDate } from 'formatDate';
import { getInitials } from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050,
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
  },

  header: {
    display: 'flex',
    alignItems: 'center'
  },
  headerText: {
    width: '40%',
    padding: '2% 5%',
    textAlign: 'center',
  },
  headerImg: {
    width: '20%',
    textAlign: 'center',
  },
  headerLogo: {
    height: 70
  },
  bodyHeader: {
    textAlign: 'center'
  },
  body: {
    display: 'flex',
    alignItems: 'center'
  },
  bodyOption: {
    width: '50%',
    padding: '0% 2%',
    textAlign: 'right',
  },
  bodyValue: {
    width: '50%',
    padding: '0 2%',
    textAlign: 'left',
  },
  footer: {
    display: 'flex',
    alignItems: 'center'
  },
  footerLeft: {
    width: '35%',
    padding: '0% 10%',
    textAlign: 'right',
  },
  footerRight: {
    width: '35%',
    padding: '0% 10%',
    textAlign: 'left',
  },
  footerCenter: {
    width: '30%',
    textAlign: 'center',
  },
  textFields: {
    [theme.breakpoints.down('lg')]: {
      width: '50%',
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    }
  }
}));

const AdvanceSearchReportResult = props => {
  const { 
    className, formState, searchResult, 
    getMaekelAndKifilNameOnAdvanceSearch,
    setGetMaekelAndKifilNameOnAdvanceSearch,
     ...rest } = props;
  const classes = useStyles();

  const [headerTitle, setHeaderTitle] = useState('የአባል መረጃ');
  const [headerBody, setHeaderBody] = useState('');
  const [maekelName, setMaekelName] = useState({
    name: [],
    abalId: []
  });
  const [kifilName, setKifilName] = useState({
    name: [],
    abalId: []
  });
  const [accountUserType, setAccountUserType] = useState({
    name: [],
    abalId: []
  });
  

  const returnMaekelName = () => {
    searchResult.find((abal) => {
      if(abal.maekel_id){
        axios.get(`${config.LOCATION()}maekel/get-name/${abal.maekel_id}`)
        .then(response => {
          setMaekelName(d => ({
            ...d,
            name: [
              ...d.name,
              response.data.data
            ],
            abalId: [
              ...d.abalId,
              abal.abalat_id
            ],
          }))        
        })        
        setGetMaekelAndKifilNameOnAdvanceSearch(false)
      }
      return null;
    })
  }
  const returnKifilName = () => {
    searchResult.find((abal) => {
      if(abal.kifil_id){
        axios.get(`${config.LOCATION()}kifil/get-name/${abal.kifil_id}`)
        .then(response => {
          setKifilName(d => ({
            ...d,
            name: [
              ...d.name,
              response.data.data
            ],
            abalId: [
              ...d.abalId,
              abal.abalat_id
            ],
          }))        
        })
        setGetMaekelAndKifilNameOnAdvanceSearch(false)
      }
      return null;
    })
  }
  const returnAccountUserType = () => {
    searchResult.find((abal) => {
      if(abal.abalat_id){
        axios.get(`${config.LOCATION()}account/get-userType/${abal.abalat_id}`)
        .then(response => {
          setAccountUserType(d => ({
            ...d,
            name: [
              ...d.name,
              response.data.data
            ],
            abalId: [
              ...d.abalId,
              abal.abalat_id
            ],
          }))
        })
        setGetMaekelAndKifilNameOnAdvanceSearch(false)
      }
      return null;
    })
  }
// console.log(searchResult)
  if(searchResult === undefined)
    return (<Typography>advance</Typography>);
  else {
    // used to stop lopping
    if(getMaekelAndKifilNameOnAdvanceSearch){
      returnMaekelName()
      returnKifilName()
      returnAccountUserType()
    }

    return (
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardContent className={classes.content} style={{border: 'dashed', marginTop: 20}} >
          <PerfectScrollbar>
            <Typography component={'span'} varient={'body1'} className={classes.inner}>
              <Typography component={'span'} varient={'body1'}  id='printLayer'>
                <Grid className={classes.header}>
                  <Typography component={'span'} varient={'body1'} className={classes.headerText}>
                    <p>በኢ/ኦ/ተ/ቤ/ክ በሰ/ት/ቤ/ማ/መ ማኅበረ ቅዱሳን መዝሙርና ኪነጥበባት አገልግሎት ማስተባበሪያ ክፍል</p>
                  </Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.headerImg}>
                    <img
                      className={classes.headerLogo}
                      alt="Logo"
                      src="/images/logos/logo.png"
                    />
                  </Typography>
                  <Typography component={'div'} varient={'div'} className={classes.headerText}>
                    <p></p>
                  </Typography>
                </Grid>
                <hr/>
                <Grid className={classes.bodyHeader}>
                  <h3>{headerTitle}</h3>
                  <p style={{padding: '1px 12%', textAlign: 'justify'}}>{headerBody}</p>
                </Grid>
                <Grid className={classes.body} style={{justifyContent: 'center'}}>
        
                  <div className={classes.innerr} style={{width: '80%'}} >
                    <Table>
                      <TableHead>
                        <TableRow>
                          {/* if name is checked */}
                          {formState.check.nameCheck ? <TableCell>ስም</TableCell> : ''} 
                          {/* if name is not checked but photo */}
                          {!formState.check.nameCheck && formState.check.photoCheck ? <TableCell> </TableCell> : ''}
                          {formState.check.maekelCheck ? <TableCell>ማዕከል</TableCell> : ''}
                          {formState.check.kifilCheck ? <TableCell>ክፍል</TableCell> : ''}
                          {formState.check.userTypeCheck ? <TableCell>የአካውንት አይነት</TableCell> : ''}
                          {formState.check.sexCheck ? <TableCell>ፆታ</TableCell> : ''}
                          {formState.check.ageCheck ? <TableCell>እድሜ</TableCell> : ''}
                          {formState.check.phoneCheck ? <TableCell>ስልክ</TableCell> : ''}
                          {formState.check.emailCheck ? <TableCell>ኢሜል</TableCell> : ''}
                          {formState.check.yegebubetAmetCheck ? <TableCell>አባል የሆኑበት አመት</TableCell> : ''}
                          {formState.check.maritalStatusCheck ? <TableCell>የቤተሰብ ሁኔታ</TableCell> : ''}
                          {formState.check.childrenStatusCheck ? <TableCell>የልጆች ሁኔታ</TableCell> : ''}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {searchResult.map((abal, index) => {
                          
                          // get name of maekel
                          var nameOfMaekel = maekelName.name.find((a, index) => {
                            if(maekelName.abalId[index] === abal.abalat_id) 
                              return(a)
                            return null;
                          });
                          // get name of kifil
                          let nameOfKifil = kifilName.name.find((a, index) => {
                            if(kifilName.abalId[index] === abal.abalat_id) 
                              return(a)
                            return null;
                          });
                          // get user type of abalat
                          let userTypeOfAccount = accountUserType.name.find((a, index) => {
                            if(accountUserType.abalId[index] === abal.abalat_id) 
                              return(a)
                            return null;
                          });

                          
                          return (
                          <TableRow className={classes.tableRow} hover key={abal.abalat_id}>

                            {formState.check.nameCheck || formState.check.photoCheck ?
                              <TableCell>
                                <div className={classes.nameContainer}>
                                  {formState.check.photoCheck ?
                                    <Avatar
                                      className={classes.avatar}
                                      src={abal.photo}
                                    >
                                      {getInitials(abal.name)}
                                    </Avatar>
                                  : '' }
                                  {formState.check.nameCheck ? <Typography variant="body1">{abal.name}</Typography> : ''}
                                </div>
                              </TableCell>
                            : ''}
                            {formState.check.maekelCheck ? <TableCell>{nameOfMaekel}</TableCell> : ''}
                            {formState.check.kifilCheck ? <TableCell>{nameOfKifil}</TableCell> : ''}
                            {formState.check.userTypeCheck ? <TableCell>{userTypeOfAccount}</TableCell> : ''}
                            {formState.check.sexCheck ? <TableCell>{abal.sex}</TableCell> : ''}
                            {formState.check.ageCheck ? <TableCell>{abal.age}</TableCell> : ''}
                            {formState.check.phoneCheck ? <TableCell>{abal.phone}</TableCell> : ''}
                            {formState.check.emailCheck ? <TableCell>{abal.email}</TableCell> : ''}
                            {formState.check.yegebubetAmetCheck ? <TableCell>{abal.yegebubet_amet}</TableCell> : ''}
                            {formState.check.maritalStatusCheck ? <TableCell>{abal.marital_status}</TableCell> : ''}
                            {formState.check.childrenStatusCheck ? <TableCell>{abal.children_status}</TableCell> : ''}

                            {/* <TableCell>{maekelName}{handleReturnData(returnMaekelName, abal.abalat_id)}</TableCell> */}
                          </TableRow>
                        )})}
                      </TableBody>
                    </Table>

                    <br/>
                <hr/>
                <Grid className={classes.footer}>
                  <Typography component={'span'} varient={'body1'} className={classes.footerLeft}>ቀን</Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.footerCenter}>Reported By</Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.footerRight}>ፊርማ</Typography>
                </Grid>
                <Grid className={classes.footer}>
                  <Typography component={'span'} varient={'body1'} className={classes.footerLeft}>{formatDate(Date.now())}</Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.footerCenter}>አበበ</Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.footerRight}>
                    <p style={{textDecoration: 'underline',}}>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </p>
                  </Typography>
                </Grid>
                  </div>

                  
                </Grid>
              </Typography>
            </Typography>
            <br/>
          </PerfectScrollbar>

      
        </CardContent>

        <Typography component={'span'} varient={'body1'} style={{paddingTop: 20, minWidth: 'unset', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Card className={classes.textFields} style={{minWidth: 'unset'}}>
              <Typography component={'span'} varient={'body1'} style={{paddingTop: 15}}>
                <TextField
                  style={{marginTop: 10}}
                  className={classes.textField}
                  fullWidth
                  label='Header Text'
                  onChange={(e)=>setHeaderTitle(e.target.value)}
                  type='text'
                  value={headerTitle}
                  variant='outlined'
                />
              </Typography>
              <Typography component={'span'} varient={'body1'} style={{paddingTop: 15}}>
                <TextField
                  style={{marginTop: 10}}
                  id='familyStatusId'
                  className={classes.textField}
                  fullWidth
                  multiline
                  rows={3}
                  rowsMax={5}
                  label='Header Body'
                  name='familyStatus'
                  onChange={(e)=>setHeaderBody(e.target.value)}
                  type='text'
                  value={headerBody}
                  variant='outlined'
                />
              </Typography>
              <Typography component={'span'} varient={'body1'} style={{paddingTop: 15}}>
                <Button 
                  style={{marginTop: 10}}
                  color="primary"
                  fullWidth
                  size="large"
                  variant="contained" 
                  onClick={()=>{
                    var restorpage = document.body.innerHTML;
                    var printContent = document.getElementById('printLayer').innerHTML;
                    document.body.innerHTML = printContent;
                    window.print();
                    document.body.innerHTML = restorpage;
                  }}>
                  Print
                </Button>
              </Typography>
            </Card>
        </Typography>
      </Card>
    );
  }
};

AdvanceSearchReportResult.propTypes = {
  className: PropTypes.string,
  // abalatDetailInfo: PropTypes.array.isRequired
};

export default AdvanceSearchReportResult;
