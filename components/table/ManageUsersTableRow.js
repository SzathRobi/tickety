import { useEffect, useState } from "react";

function ManageUsersTableRow({
  user = null,
  addAvaibleSelectedUsers = null,
  removeAvaibleSelectedUsers = null,
  addAssignedSelectedUsers = null,
  removeAssignedSelectedUsers = null,
}) {
  const [checked, setChecked] = useState(false);
  const toggleChecked = () => {
    setChecked(!checked);
    checked
      ? removeAvaibleSelectedUsers
        ? removeAvaibleSelectedUsers(user)
        : removeAssignedSelectedUsers(user)
      : addAvaibleSelectedUsers
      ? addAvaibleSelectedUsers(user)
      : addAssignedSelectedUsers(user);
  };

  return (
    <tr key={user._id} className="even:bg-gray-200">
      <td className="px-2 py-1">{user?.email || "error"}</td>
      <td className="px-2 py-1">{user?.user_metadata?.role || ""}</td>
      <td className="text-right px-2 py-1">
        <input type="checkbox" checked={checked} onChange={toggleChecked} />
      </td>
    </tr>
  );
}

export default ManageUsersTableRow;
