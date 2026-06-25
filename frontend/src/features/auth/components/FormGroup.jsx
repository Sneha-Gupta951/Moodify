import React from "react";

const FormGroup = ({ label, type, id, name, value, onChange }) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
      value= {value}
      onChange={onChange}
        type={type}
        id={id}
        name={name}
        required
      />
    </div>
  );
};

export default FormGroup;