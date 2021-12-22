import React, { useState } from "react";

function MultiSelectRow({ user, updateAssignedUsers }) {
  const [isChecked, setIsChecked] = useState(false);
  const toggleIsChecked = () => setIsChecked((isChecked) => !isChecked);
  const handleChange = () => {
    updateAssignedUsers(user, isChecked);
    toggleIsChecked();
  };
  return (
    <label
      key={user.email}
      className="flex justify-between items-center p-2 bg-gray-200 hover:bg-gray-300 transition-colors hover:cursor-pointer border-b-2 border-black/40"
    >
      <p>{user.email}</p>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => handleChange()}
      />
    </label>
  );
}

export default MultiSelectRow;
