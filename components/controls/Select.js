import React from "react";

function Select({
  value,
  onChange,
  disabled = false,
  children,
  multiselect = false,
}) {
  return (
    <select
      value={value}
      defaultValue={value}
      onChange={onChange}
      disabled={disabled}
      multiple={multiselect}
      className="relative z-1 pr-8"
    >
      {children}
    </select>
  );
}

export default Select;
