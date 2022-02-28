import React from "react";

function Select({
  value,
  name = "",
  onChange,
  disabled = false,
  children,
  multiselect = false,
}) {
  return (
    <select
      value={value}
      name={name}
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
