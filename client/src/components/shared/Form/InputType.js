import React from "react";

const InputType = ({
  labelText,
  labelFor,
  inputType,
  value,
  onChange,
  name,
}) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor={labelFor} className="form-label">
          {labelText}
        </label>
        <input
          type={inputType}
          className="form-control"
          name={name}
          value={value}
          onChange={onChange}
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--text-base)',
            fontWeight: '500',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid rgba(0, 0, 0, 0.1)',
            transition: 'var(--transition-normal)'
          }}
        />
      </div>
    </>
  );
};

export default InputType;
