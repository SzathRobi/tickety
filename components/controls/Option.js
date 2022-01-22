import React from "react";

function Option({ value, children }) {
  return <option value={value}>{children}</option>;
}

export default Option;
