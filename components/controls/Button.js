import React from "react";

function Button({ onClick = null, children }) {
  return (
    <button
      onClick={() => onClick()}
      className="flex items-center  py-2 px-4 text-white text-sm bg-blue-600 cursor-pointer transition-all hover:bg-blue-800"
    >
      {children}
    </button>
  );
}

export default Button;
