import { useState } from "react";
import MultiSelectRow from "./MultiSelectRow";

function MultiSelect({ users, assignedUsers, setAssignedUsers }) {
  const updateAssignedUsers = (user, checked) => {
    if (!checked) {
      setAssignedUsers([...assignedUsers, user]);
      console.log(assignedUsers);
      //assignedUsers.push(user.email);
    } else {
      const newArr = assignedUsers.filter(
        (assignedUser) => assignedUser != user
      );
      setAssignedUsers(newArr);
    }
    console.log("assignedUsers:", assignedUsers);
  };

  return (
    <div>
      <h6 className="mb-2">Assign Devs</h6>
      <div>
        {users.map((user) => (
          <MultiSelectRow
            key={user.email}
            user={user}
            updateAssignedUsers={updateAssignedUsers}
          />
        ))}
      </div>
      <ul>
        {assignedUsers.map((assignedUser) => (
          <p key={assignedUser.email}>{assignedUser.email}</p>
        ))}
      </ul>
    </div>
  );
}

export default MultiSelect;
