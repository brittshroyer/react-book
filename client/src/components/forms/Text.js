import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const Text = (props) => {
  const editIcon = props.editable ? <i className="fa fa-pencil"></i> : null;
  const disabled = props.disabled;

  if (disabled) {
    return (
      <div className="Detail-item">
        {props.label} <span className="Detail-value">{props.value}</span>
      </div>
    );
  }

  return (
    <FormGroup
      validationState={props.validationState}
    >
      <ControlLabel>{props.label}</ControlLabel>
      <FormControl
        type="text"
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
      <p className="text-right username-requirement">{props.subtext}</p>
      {editIcon}
      <FormControl.Feedback />
    </FormGroup>
  );
}

export default Text;
