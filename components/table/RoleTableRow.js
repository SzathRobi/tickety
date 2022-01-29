import { useState } from "react";
import { updateData } from "../../utilities/updateData";

function RoleTableRow({ user }) {
  const [rolePopupOpen, setRolePopupOpen] = useState(false);
  const toggleRolePopupOpen = () => setRolePopupOpen(!rolePopupOpen);

  const [role, setRole] = useState(user?.user_metadata?.role || "none");
  const updateRole = async (userRole) => {
    updateData(`users/${user.email}`, { role: userRole });
    setRole(userRole);
  };

  return (
    <tr /*key={user._id}*/ className="border-b-2 border-gray-400">
      <td className="px-2 py-1">{user.email}</td>
      <td className="px-2 py-1">{role}</td>
      <td className="px-2 py-1">
        <div className="relative">
          <button
            onClick={() => toggleRolePopupOpen()}
            className="relative ml-auto flex items-center gap-1 p-1 rounded text-white text-sm bg-cyan-600 transition-all hover:bg-cyan-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
          {/*Role Popup menu */}
          <div
            className={`${
              rolePopupOpen ? "block" : "hidden"
            } grid grid-cols-3 absolute top-10 right-0 lg:-right-2 z-20 bg-neutral-50 border-2 border-slate-600 rounded w-72`}
          >
            <div
              onClick={() => {
                toggleRolePopupOpen();
                updateRole("project_manager");
                setRole("project_manager");
              }}
              className="group cursor-pointer flex flex-col gap-2 items-center text-center justify-between p-2 hover:bg-orange-500 transition-colors"
            >
              <h4 className="group-hover:text-white">Project Manager</h4>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-orange-500 group-hover:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div
              onClick={() => {
                toggleRolePopupOpen();
                updateRole("developer");
                setRole("developer");
              }}
              className="group cursor-pointer flex flex-col gap-2 items-center justify-between p-2 text-center hover:bg-teal-500 transition-colors"
            >
              <h4 className="group-hover:text-white">Developer</h4>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-teal-500 group-hover:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div
              onClick={() => {
                toggleRolePopupOpen();
                updateRole("submitter");
                setRole("submitter");
              }}
              className="group cursor-pointer flex flex-col gap-2 items-center justify-between p-2 text-center hover:bg-rose-500 transition-colors"
            >
              <h4 className="group-hover:text-white">Submitter</h4>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-rose-500 group-hover:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default RoleTableRow;
