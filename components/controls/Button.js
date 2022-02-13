import React from "react";

function Button({ onClick = null, children, disabled = false, style = {} }) {
  return (
    <button
      onClick={() => onClick()}
      className={`flex items-center py-2 px-4 text-white text-sm ${
        disabled ? "bg-blue-300" : "bg-blue-600"
      } cursor-pointer transition-all hover:bg-blue-800`}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;
