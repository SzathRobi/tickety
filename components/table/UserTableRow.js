import { useContext, useState } from "react";
import UserContext from "../../contexts/userContext";

function UserTableRow({ user, removeUsersFromProject }) {
  //const [isPopupOpen, setIsPopUpOpen] = useState(false);
  //  const togglePopupOpen = () => setIsPopUpOpen(!isPopupOpen);

  //const [rolePopupOpen, setRolePopupOpen] = useState(false);
  //const toggleRolePopupOpen = () => setRolePopupOpen(!rolePopupOpen);
  const { dbUser } = useContext(UserContext);
  return (
    <tr className="border-b-4 border-stone-400" key={user.email}>
      <td className="p-1">{user.email}</td>
      <td className="p-1">
        {user?.user_metadata?.role ? user.user_metadata.role : "not assigned"}
      </td>
      <td className="p-1 relative">
        <div className="relative">
          {dbUser?.user_metadata?.role === "project_manager" && (
            <button
              onClick={() => removeUsersFromProject(user)}
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
          {/*Options Popup menu */}
          {/*<div
            className={`${
              isPopupOpen ? "block" : "hidden"
            } rounded overflow-hidden absolute top-0 right-10 w-32 bg-neutral-500 text-white`}
          >
            <button
              onClick={() => toggleRolePopupOpen()}
              className="flex item-center justify-evenly w-full py-2 transition-all hover:bg-neutral-600"
            >
              Manage Role
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
            <button
              onClick={() => removeUsersFromProject(user)}
              className="flex item-center justify-evenly w-full py-2 transition-all hover:bg-neutral-600"
            >
              Remove User
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
          */}
          {/*Role Popup menu */}
          {/* 
          <div
            className={`${
              rolePopupOpen ? "block" : "hidden"
            } grid grid-cols-3 absolute top-20 right-12 lg:-right-2 z-20 bg-neutral-50 border-2 border-slate-600 rounded w-72`}
          >
            <div
              onClick={() => {
                togglePopupOpen();
                toggleRolePopupOpen();
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
                togglePopupOpen();
                toggleRolePopupOpen();
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
                togglePopupOpen();
                toggleRolePopupOpen();
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
          */}
        </div>
      </td>
    </tr>
  );
}

export default UserTableRow;
