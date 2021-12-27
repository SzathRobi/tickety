//import { useRouter } from "next/router";
import { useState } from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Modal from "../../components/modal/Modal";
import UserTableRow from "../../components/table/UserTableRow";

function Project({ project, users }) {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    const [descShown, setDescShown] = useState(false);
    const toggleDescShown = () => setDescShown((descShown) => !descShown);

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const toggleUserModalOpen = () =>
      setIsUserModalOpen((isUserModalOpen) => !isUserModalOpen);

    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const toggleTicketModalOpen = () =>
      setIsTicketModalOpen((isTicketModalOpen) => !isTicketModalOpen);

    const [assignedUsers, setAssignedUsers] = useState(project.devs_assigned);

    const assignNewUser = (user) => {
      setAssignedUsers([...assignedUsers, user]);
      console.log("assignedUsers:", assignedUsers);
    };
    const assignUsersToProject = async () => {
      const newProject = project;
      newProject = { ...newProject, devs_assigned: assignedUsers };
      console.log("newProject:", newProject);
      const res = await fetch(`/api/projects/${project.name}`, {
        method: "PUT",
        body: JSON.stringify(assignedUsers),
      });
      const data = await res.json();
      console.log("data:", data);
    };

    const removeAssignedUser = (user) => {
      const userIndex = assignedUsers.indexOf(user);
      assignedUsers.splice(userIndex, 1);
      console.log(assignedUsers);
    };

    const removeUsersFromProject = async (user) => {
      removeAssignedUser(user);
      const newProject = project;
      newProject = { devs_assigned: assignedUsers };
      console.log("newProject:", newProject);
      const res = await fetch(`/api/projects/${project.name}`, {
        method: "PUT",
        body: JSON.stringify(assignedUsers),
      });
      const data = await res.json();
      console.log("data:", data);
    };

    const [tickets, setTickets] = useState([
      {
        id: 1,
        title: "demo ticket",
        submitter: "demo submitter",
        developer: "demo developer",
        status: "open",
        priority: "medium",
        created: "2022.12.23 14:50",
      },
    ]);

    return (
      <section className="p-4 md:pl-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 md:flex-row md:justify-start">
            <h1 className="text-3xl">{project.name}</h1>
            <div>
              <button
                onClick={() => toggleDescShown()}
                className="flex items-center p-2 bg-gray-200 mb-1"
              >
                Description
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
                    d="M17 13l-5 5m0 0l-5-5m5 5V6"
                  />
                </svg>
              </button>
              <p
                className={`${
                  descShown ? "max-h-20 p-2" : "max-h-0 p-0"
                } overflow-hidden w-11/12 transition-all bg-red-300 absolute`}
              >
                Here will be some short description about the project to explain
                users whats this going to be. Maybe it will be optional.
              </p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold px-2 py-4 rounded bg-teal-200">
                Current devs in this project
              </h2>
              <button
                onClick={() => toggleUserModalOpen()}
                className="rounded my-2 py-2 px-4 text-white text-sm bg-blue-600 cursor-pointer transition-all hover:bg-blue-800"
              >
                ADD NEW USER
              </button>
              <table className="w-full table-auto text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-1">Email</th>
                    <th className="p-1">Role</th>
                    <th className="p-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {project.devs_assigned.map((dev) => (
                    <UserTableRow
                      key={dev.id}
                      user={dev}
                      removeUsersFromProject={removeUsersFromProject}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <Modal isOpen={isUserModalOpen} updateIsOpen={toggleUserModalOpen}>
              <div className="flex flex-col rounded overflow-hidden relative">
                <button
                  onClick={() => toggleUserModalOpen()}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center font-medium text-white rounded-full bg-red-600 hover:bg-red-700 transition-all focus:outline-4"
                >
                  X
                </button>
                <h3 className="bg-gray-200 font-medium p-4">Assign User</h3>
                <ul className="bg-white py-1 flex flex-col">
                  {users.map((user) => {
                    return (
                      <li
                        key={user.email}
                        onClick={() => assignNewUser(user)}
                        className="w-full hover:bg-zinc-300"
                      >
                        <label className="cursor-pointer p-4 flex justify-between items-center gap-4">
                          <p>{user.email}</p>
                          <input type="checkbox" className="cursor-pointer" />
                        </label>
                      </li>
                    );
                  })}
                </ul>
                <button
                  onClick={() => assignUsersToProject()}
                  className="rounded mb-8 py-2 px-4 text-white text-sm bg-blue-600 cursor-pointer transition-all hover:bg-blue-800"
                >
                  ADD NEW USER
                </button>
              </div>
            </Modal>

            {/*//////////////////////////////////////////////////////////////////////////*/}

            <div>
              <h2 className="text-xl font-semibold px-2 py-4 rounded bg-teal-200">
                Tickets for this projects
              </h2>
              <button
                onClick={() => toggleTicketModalOpen()}
                className="rounded my-2 py-2 px-4 text-white text-sm bg-blue-600 cursor-pointer transition-all hover:bg-blue-800"
              >
                ADD NEW TICKET
              </button>
              <table className="w-full table-auto text-left mb-2">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Title</th>
                    <th className="p-2 hidden sm:block">Submitter</th>
                    <th className="p-2">Dev</th>
                    <th className="p-2 hidden sm:block">Status</th>
                    <th className="p-2">Priority</th>
                    <th className="p-2 hidden sm:block">Created</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      className="border-b-4 border-stone-400 "
                      key={ticket.id}
                    >
                      <td className="p-2">{ticket.title}</td>
                      <td className="p-2 hidden sm:table-cell">
                        {ticket.submitter}
                      </td>
                      <td className="p-2">{ticket.developer}</td>
                      <td className="p-2 hidden sm:table-cell">
                        {ticket.status}
                      </td>
                      <td className="p-2">{ticket.priority}</td>
                      <td className="p-2 hidden sm:table-cell">
                        {ticket.created}
                      </td>
                      <td className="p-2">
                        <button className="flex items-center gap-1 p-1 rounded text-white text-sm bg-cyan-600 transition-all hover:bg-cyan-800">
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
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal
              isOpen={isTicketModalOpen}
              updateIsOpen={toggleTicketModalOpen}
            >
              <form>
                <h1 className="p-8 bg-red-500">hell yeah Tickets</h1>
                <label>
                  <p>Title</p>
                  <input type="text" />
                </label>
                <label>
                  <p>Description</p>
                  <input type="text" />
                </label>
              </form>
            </Modal>
          </div>
        </div>
      </section>
    );
  }
}
export async function getServerSideProps({ params }) {
  const project_name = params.project;
  const projectRes = await fetch(
    `http://localhost:3000/api/projects/${project_name}`,
    {
      method: "GET",
    }
  );
  const project = await projectRes.json();

  const usersRes = await fetch("http://localhost:3000/api/users", {
    method: "GET",
  });
  const users = await usersRes.json();

  return {
    props: { project: project.data[0], users: users.data },
  };
}
export default withPageAuthRequired(Project);
