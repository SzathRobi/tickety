import React from "react";

function Input({
  type = "text",
  value = "",
  onChange = null,
  disabled = false,
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event)}
      className="p-1 rounded shadow-md border border-gray-400 shadow-gray-400 outline-none"
      disabled={disabled}
    />
  );
}

export default Input;
