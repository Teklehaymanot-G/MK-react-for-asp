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
// import MoreVertIcon from '@material-ui/icons/MoreVert';

// import { getInitials } from 'helpers';

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

const ReportResult = props => {
  const { className, memberDetailInfo, ...rest } = props;
  const classes = useStyles();

  const [headerTitle, setHeaderTitle] = useState('የአባል መረጃ');
  const [headerBody, setHeaderBody] = useState('');


  if(memberDetailInfo.data === undefined)
    return (<div></div>);
  else {
    const member = memberDetailInfo.data;
    // const currentDate = Date();
    console.log(memberDetailInfo);
    console.log(member);

    return (
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <div style={{border: 'dashed'}} id='printLayer'>
                <Grid className={classes.header}>
                  <div className={classes.headerText}><p>የአዲስ አበባ ከተማ እሳትና ድንገተኛ አደጋ መከላከል እና መቆጣጠር ባለስልጣን</p></div>
                  <div className={classes.headerImg}>
                    <img
                      className={classes.headerLogo}
                      alt="Logo"
                      src="/images/logos/logo.png"
                    />
                  </div>
                  <div className={classes.headerText}><p>Addis Ababa city fire and emergency prevention and rescue autority</p></div>
                </Grid>
                <hr/>
                <Grid className={classes.bodyHeader}>
                  <h3>{headerTitle}</h3>
                  <p style={{padding: '1px 12%', textAlign: 'justify'}}>{headerBody}</p>
                </Grid>
                <Grid className={classes.body}>
                  <div className={classes.bodyOption}>የአባሉ ሙሉ ስም</div>
                  <div className={classes.bodyValue}>{member.name}</div>
                </Grid>
                <Grid className={classes.body}>
                  <div className={classes.bodyOption}>እድሜ</div>
                  <div className={classes.bodyValue}>{member.age}</div>
                </Grid>
                <Grid className={classes.body}>
                  <div className={classes.bodyOption}>ጾታ</div>
                  <div className={classes.bodyValue}>{member.sex}</div>
                </Grid>
                <Grid className={classes.body}>
                  <div className={classes.bodyOption}>ስልክ</div>
                  <div className={classes.bodyValue}>{member.phone}</div>
                </Grid>
                <Grid className={classes.body}>
                  <div className={classes.bodyOption}>ኢሜል</div>
                  <div className={classes.bodyValue}>{member.email}</div>
                </Grid>
                <Grid className={classes.body}>
                  <div className={classes.bodyOption}>የማኅበረ ቅዱሳን የአባልነት መለያ ቁጥር</div>
                  <div className={classes.bodyValue}>{member.mk_member_id}</div>
                </Grid>
                <Grid className={classes.body}>
                  <div className={classes.bodyOption}>የጋብቻ ሁኔታ</div>
                  <div className={classes.bodyValue}>{member.marital_status}</div>
                </Grid>
                <Grid className={classes.body}>
                  <div className={classes.bodyOption}>የቤተሰብ ሁኔታ</div>
                  <div className={classes.bodyValue}>{member.family_status}</div>
                </Grid>
                <Grid className={classes.body}>
                  <div className={classes.bodyOption}>መረጃው የተመዘገበው በ</div>
                  <div className={classes.bodyValue}>{member.created_by}</div>
                </Grid>
                <Grid className={classes.body}>
                  <div className={classes.bodyOption}>መረጃው የተመዘገበበት ቀን</div>
                  <div className={classes.bodyValue}>{member.created_on}</div>
                </Grid>
                <Grid className={classes.body}>
                  <div className={classes.bodyOption}>መረጃው የተስተካከለው በ</div>
                  <div className={classes.bodyValue}>{member.modified_by}</div>
                </Grid>
                <Grid className={classes.body}>
                  <div className={classes.bodyOption}>መረጃው የተስተካከለበት ቀን</div>
                  <div className={classes.bodyValue}>{member.modified_on}</div>
                </Grid>
                <br/>
                <hr/>
                <Grid className={classes.footer}>
                  <div className={classes.footerLeft}>ቀን</div>
                  <div className={classes.footerCenter}>Reported By</div>
                  <div className={classes.footerRight}>ፊርማ</div>
                </Grid>
                <Grid className={classes.footer}>
                  <div className={classes.footerLeft}>sd</div>
                  <div className={classes.footerCenter}>አበበ</div>
                  <div className={classes.footerRight}>
                    <p style={{textDecoration: 'underline',}}>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </p>
                  </div>
                </Grid>
              </div>
            </div>
            <br/>
          </PerfectScrollbar>

          <div style={{minWidth: 'unset', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Card className={classes.textFields} key={member.id} style={{minWidth: 'unset'}}>
              <Typography style={{paddingTop: 15}}>
                <TextField
                  className={classes.textField}
                  fullWidth
                  label='Header Text'
                  onChange={(e)=>setHeaderTitle(e.target.value)}
                  type='text'
                  value={headerTitle}
                  variant='outlined'
                />
              </Typography>
              <Typography style={{paddingTop: 15}}>
                <TextField
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
              <Typography style={{paddingTop: 15}}>
                <Button 
                  // className={classes.signInButton}
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
          </div>
        </CardContent>
      </Card>
    );
  }
};

ReportResult.propTypes = {
  className: PropTypes.string,
  // memberDetailInfo: PropTypes.ob.isRequired
};

export default ReportResult;
