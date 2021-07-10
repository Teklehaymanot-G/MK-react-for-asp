import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Button
} from '@material-ui/core';

import { formatDate } from 'formatDate';

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

const SimpleSearchReportResult = props => {
  const { className, abalatDetailInfo, ...rest } = props;
  const classes = useStyles();
console.log(abalatDetailInfo)
  const [headerTitle, setHeaderTitle] = useState('የአባል መረጃ');
  const [headerBody, setHeaderBody] = useState('');

  if(abalatDetailInfo.data === undefined || 
      abalatDetailInfo.created_by === undefined || 
      abalatDetailInfo.modified_by === undefined)
    return (<Typography></Typography>);
  else {
    
    const abalat = abalatDetailInfo.data.pop();
    const created_by = abalatDetailInfo.created_by.pop();
    const modified_by = abalatDetailInfo.modified_by.pop();
    
    abalatDetailInfo.data.push(abalat)
    abalatDetailInfo.created_by.push(created_by)
    abalatDetailInfo.modified_by.push(modified_by)

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
                <Grid className={classes.body}>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyOption}>የአባሉ ሙሉ ስም</Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyValue}>{abalat.name}</Typography>
                </Grid>
                <Grid className={classes.body}>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyOption}>እድሜ</Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyValue}>{abalat.age}</Typography>
                </Grid>
                <Grid className={classes.body}>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyOption}>ጾታ</Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyValue}>{abalat.sex}</Typography>
                </Grid>
                <Grid className={classes.body}>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyOption}>ስልክ</Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyValue}>{abalat.phone}</Typography>
                </Grid>
                <Grid className={classes.body}>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyOption}>ኢሜል</Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyValue}>{abalat.email}</Typography>
                </Grid>
                <Grid className={classes.body}>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyOption}>የማኅበረ ቅዱሳን የአባልነት መለያ ቁጥር</Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyValue}>{abalat.mk_abalat_id}</Typography>
                </Grid>
                <Grid className={classes.body}>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyOption}>የጋብቻ ሁኔታ</Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyValue}>{abalat.marital_status}</Typography>
                </Grid>
                <Grid className={classes.body}>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyOption}>የቤተሰብ ሁኔታ</Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyValue}>{abalat.family_status}</Typography>
                </Grid>
                <Grid className={classes.body}>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyOption}>መረጃው የተመዘገበው በ</Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyValue}>{created_by.name}</Typography>
                </Grid>
                <Grid className={classes.body}>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyOption}>መረጃው የተመዘገበበት ቀን</Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyValue}>{formatDate(abalat.created_on)}</Typography>
                </Grid>
                <Grid className={classes.body}>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyOption}>መረጃው የተስተካከለው በ</Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyValue}>{modified_by.name}</Typography>
                </Grid>
                <Grid className={classes.body}>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyOption}>መረጃው የተስተካከለበት ቀን</Typography>
                  <Typography component={'span'} varient={'body1'} className={classes.bodyValue}>{formatDate(abalat.modified_on)}</Typography>
                </Grid>
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
              </Typography>
            </Typography>
            <br/>
          </PerfectScrollbar>

      
        </CardContent>

        <Typography component={'span'} varient={'body1'} style={{paddingTop: 20, minWidth: 'unset', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Card className={classes.textFields} key={abalat.id} style={{minWidth: 'unset'}}>
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

SimpleSearchReportResult.propTypes = {
  className: PropTypes.string,
  // abalatDetailInfo: PropTypes.array.isRequired
};

export default SimpleSearchReportResult;
