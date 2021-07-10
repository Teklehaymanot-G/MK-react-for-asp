import React from 'react';
import PropTypes from 'prop-types';

const AlertBox = props => {
  const buildAlertBox = (cName, header, body) => {
    return(
      <div className={cName} role="alert">
        <strong>{header}</strong> {body}
        {/* <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button> */}
      </div>
    )
  }

  if(props.data.firstTime){
    return buildAlertBox();
  }
  else if(props.data.success){
    return buildAlertBox(
      "alert alert-success alert-dismissible fade show", 
      "Suucess", 
      "የአባላት መረጃ በትክክል ተመዝግቧል።");
  }
  else {
    return buildAlertBox(
      "alert alert-danger alert-dismissible fade show", 
      "Error", 
      "ይቅርታ ሲስተሙ ችግር አጋጥሞታል። እባክዎ ደግመው ይሞክሩ።");
  }
};

AlertBox.propTypes = {
  className: PropTypes.string
};

export default AlertBox;
