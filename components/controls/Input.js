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
      className={`p-1 ${
        disabled === false
          ? "rounded shadow-md border border-gray-400 shadow-gray-400 outline-none transition-colors"
          : "shadow-md border border-white shadow-white outline-none transition-colors text-gray-600"
      }`}
      disabled={disabled}
    />
  );
}

export default Input;
