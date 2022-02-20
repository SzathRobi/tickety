//import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Modal from "../../components/modal/Modal";
import UserTableRow from "../../components/table/UserTableRow";
import Link from "next/link";
import { formatDate } from "../../utilities/formatDate";
import UserContext from "../../contexts/userContext";
import { sortArr } from "../../utilities/sortArr";

function Project({ project = {}, users = [], tickets = [] }) {
  const { user, error, isLoading } = useUser();
  const { dbUser } = useContext(UserContext);

  const [descShown, setDescShown] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState(project.devs_assigned);

  const [newTicket, setNewTicket] = useState({
    title: "",
    desc: "",
    project: project.name,
    status: "new",
    type: "bug",
    priority: "low",
    submitter: user.nickname,
    devs_assigned: [],
  });

  const [projectTickets, setProjectTickets] = useState(
    tickets.filter((ticket) => ticket.project === project.name)
  );
  const [projectUsersSorter, setProjectUsersSorter] = useState("email");
  const [projectTicketsSorter, setProjectTicketsSorter] = useState("status");

  useEffect(() => {
    if (assignedUsers) {
      sortArr(assignedUsers, projectUsersSorter);
    }
  }, [projectUsersSorter, assignedUsers]);

  useEffect(() => {
    if (projectTickets) {
      sortArr(projectTickets, projectTicketsSorter);
    }
  }, [projectTicketsSorter, projectTickets]);

  useEffect(() => {
    if (assignedUsers) {
      sortArr(assignedUsers, projectUsersSorter);
    }
  }, [projectUsersSorter, assignedUsers]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    const toggleDescShown = () => setDescShown((descShown) => !descShown);

    const toggleUserModalOpen = () =>
      setIsUserModalOpen((isUserModalOpen) => !isUserModalOpen);

    const toggleTicketModalOpen = () =>
      setIsTicketModalOpen((isTicketModalOpen) => !isTicketModalOpen);

    const assignNewUser = (user) => {
      setAssignedUsers(assignedUsers.concat(user));
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

    const updateNewTicket = (event) => {
      setNewTicket({ ...newTicket, [event.target.name]: event.target.value });
      console.log(newTicket);
    };

    const addNewTicket = async (event) => {
      event.preventDefault();
      const res = await fetch("/api/tickets", {
        method: "POST",
        body: JSON.stringify(newTicket),
      });
      const data = await res.json();
      setIsTicketModalOpen(false);
      setProjectTickets(projectTickets.concat(newTicket));
      console.log(data);
    };

    return (
      <section className="p-4 pt-16 md:pl-16">
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
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold px-2 py-4 rounded bg-teal-200">
                Current devs in this project
              </h2>
              {dbUser?.user_metadata?.role === "project_manager" && (
                <button
                  onClick={() => toggleUserModalOpen()}
                  className="rounded my-2 py-2 px-4 text-white text-sm bg-blue-600 cursor-pointer transition-all hover:bg-blue-800"
                >
                  ADD NEW USER
                </button>
              )}
              <table className="w-full table-auto text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <td>
                      <label>
                        Sort by:{" "}
                        <select
                          value={projectUsersSorter}
                          onChange={(event) =>
                            setProjectUsersSorter(event.target.value)
                          }
                        >
                          <option value="email">Email</option>
                          <option value="role">Role</option>
                        </select>
                      </label>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
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
              {/**sssssssssssssssssssssssssssssssssssssssssssssssssss */}
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
                          <input
                            type="checkbox"
                            className="cursor-pointer"
                            checked={assignedUsers.some(
                              (assignedUser) =>
                                assignedUser.email === user.email
                            )}
                          />
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

            <div className="flex-1">
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
                    <td>
                      <label>
                        Sort by:{" "}
                        <select
                          value={projectTicketsSorter}
                          onChange={(event) =>
                            setProjectTicketsSorter(event.target.value)
                          }
                        >
                          <option value="status">Status</option>
                          <option value="priority">Priority</option>
                          <option value="submitter">Submitter</option>
                        </select>
                      </label>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
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
                  {projectTickets.map((ticket) => (
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
                        {formatDate(ticket.created_at)}
                      </td>
                      <td className="p-2">
                        <Link
                          href={`/my_projects/${project.name}/${ticket._id}`}
                        >
                          <a className="w-8 flex items-center gap-1 p-1 rounded text-white text-sm bg-cyan-600 transition-all hover:bg-cyan-800">
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
                          </a>
                        </Link>
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
              <div className="flex flex-col rounded overflow-hidden relative bg-white">
                <button
                  onClick={() => toggleTicketModalOpen()}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center font-medium text-white rounded-full bg-red-600 hover:bg-red-700 transition-all focus:outline-4"
                >
                  X
                </button>
                <h3 className="bg-gray-200 font-medium p-4">Add New Ticket</h3>
                <div className="flex flex-col p-2">
                  <label>
                    <p>Title</p>
                    <input
                      onChange={(event) => updateNewTicket(event)}
                      name="title"
                      type="text"
                    />
                  </label>
                  <label>
                    <p>Description</p>
                    <textarea
                      onChange={(event) => updateNewTicket(event)}
                      name="desc"
                      rows={3}
                    ></textarea>
                  </label>
                  <label>
                    <p>Priotity</p>
                    <select
                      onChange={(event) => updateNewTicket(event)}
                      name="priority"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </label>
                  <label>
                    <p>Type</p>
                    <select
                      onChange={(event) => updateNewTicket(event)}
                      name="type"
                    >
                      <option value="bug">Bug/Error</option>
                      <option value="feature request">Feature Request</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </div>
                <button
                  onClick={(event) => addNewTicket(event)}
                  className="py-2 px-4 text-white text-sm bg-blue-600 cursor-pointer transition-all hover:bg-blue-800"
                >
                  CREATE TICKET
                </button>
              </div>
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
    `${process.env?.SITE_URL}/api/projects/${project_name}` ||
      `http://localhost:3000/api/projects/${project_name}`,
    {
      method: "GET",
    }
  );
  const project = await projectRes.json();

  const usersRes = await fetch(
    `${process.env?.SITE_URL}/api/users` || "http://localhost:3000/api/users",
    {
      method: "GET",
    }
  );
  const users = await usersRes.json();

  const ticketsRes = await fetch(
    `${process.env?.SITE_URL}/api/tickets` ||
      "http://localhost:3000/api/tickets",
    {
      method: "GET",
    }
  );
  const tickets = await ticketsRes.json();

  return {
    props: {
      project: project.data[0],
      users: users.data,
      tickets: tickets.data,
    },
  };
}
export default withPageAuthRequired(Project);
