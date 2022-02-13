import { useState, useEffect } from "react";
import Button from "../../components/controls/Button";
import Input from "../../components/controls/Input";
import ManageUsersTableRow from "../../components/table/ManageUsersTableRow";
import RoleTableRow from "../../components/table/RoleTableRow";
import { formatDate } from "../../utilities/formatDate";

function Index({ users = [], projects = [] }) {
  console.log(users);
  const [selectedProject, setSelectedProject] = useState(null);
  const updateSelectedProject = (event) => {
    setSelectedProject(
      projects.filter((project) => project.name === event.target.value)[0]
    );
  };
  const [avaibleUsers, setAvaibleUsers] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState(null);
  useEffect(() => {
    const filteredUsers = [];
    users.map((user) => {
      selectedProject?.devs_assigned.some((dev) => user.email === dev.email)
        ? null
        : filteredUsers.push(user);
    });
    selectedProject && setAvaibleUsers(filteredUsers);
    selectedProject && setAssignedUsers(selectedProject.devs_assigned);
  }, [selectedProject]);

  const [avaibleSelectedUsers, setAvaibleSelectedUsers] = useState([]);
  const addAvaibleSelectedUsers = (user) => {
    setAvaibleSelectedUsers(avaibleSelectedUsers.concat(user));
  };

  const removeAvaibleSelectedUsers = (user) => {
    const removedUsers = avaibleSelectedUsers.filter(
      (avaibleSelectedUser) => avaibleSelectedUser !== user
    );
    setAvaibleSelectedUsers(removedUsers);
  };

  const assignUsers = () => {
    setAvaibleUsers(
      avaibleUsers.filter(
        (avaibleUser) => !avaibleSelectedUsers.includes(avaibleUser)
      )
    );
    setAssignedUsers(assignedUsers.concat(avaibleSelectedUsers));
    /**
     *POST fetch here
     */
  };

  ////////////////////////

  const [assignedSelectedUsers, setAssignedSelectedUsers] = useState([]);
  const addAssignedSelectedUsers = (user) => {
    setAssignedSelectedUsers(assignedSelectedUsers.concat(user));
  };

  const removeAssignedSelectedUsers = (user) => {
    const removedUsers = assignedSelectedUsers.filter(
      (assignedSelectedUser) => assignedSelectedUser !== user
    );
    setAssignedSelectedUsers(removedUsers);
  };

  const removeUsers = () => {
    setAssignedUsers(
      assignedUsers.filter(
        (assignedUser) => !assignedSelectedUsers.includes(assignedUser)
      )
    );
    setAvaibleUsers(avaibleUsers.concat(assignedSelectedUsers));
    /**
     *POST fetch here
     */
  };

  return (
    <main className="p-4 md:pl-20 pt-20">
      <section>
        <h2 className="bg-teal-200 mt-2 p-2 text-xl font-medium">
          Manage Project Users
        </h2>
        <label>
          <p>Select Project</p>
          <select onChange={(event) => updateSelectedProject(event)}>
            <option>Choose a project</option>
            {projects &&
              projects.map((project) => (
                <option key={project._id} value={project.name}>
                  {project?.name}
                </option>
              ))}
          </select>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col items-start justify-between">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-300">
                  <td>Avaible Users</td>
                  <td className="opacity-0">hidden</td>
                  <td className="opacity-0">hidden</td>
                </tr>
              </thead>
              <tbody>
                {avaibleUsers &&
                  avaibleUsers.map((user) => (
                    <ManageUsersTableRow
                      key={user._id}
                      user={user}
                      addAvaibleSelectedUsers={addAvaibleSelectedUsers}
                      removeAvaibleSelectedUsers={removeAvaibleSelectedUsers}
                    />
                  ))}
              </tbody>
            </table>
            <Button onClick={assignUsers}>ASSIGN USER</Button>
          </div>
          <div className="flex flex-col items-start justify-between">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-300">
                  <td>Assigned Users</td>
                  <td className="opacity-0">hidden</td>
                  <td className="opacity-0">hidden</td>
                </tr>
              </thead>
              <tbody>
                {assignedUsers &&
                  assignedUsers.map((dev) => (
                    <ManageUsersTableRow
                      key={dev._id}
                      user={dev}
                      addAssignedSelectedUsers={addAssignedSelectedUsers}
                      removeAssignedSelectedUsers={removeAssignedSelectedUsers}
                    />
                  ))}
              </tbody>
            </table>
            <Button onClick={removeUsers}>REMOVE USER</Button>
          </div>
        </div>
      </section>
      <section>
        <h2 className="bg-teal-200 mt-2 p-2 text-xl font-medium">
          Manage User Roles
        </h2>
        <div className="p-2 flex flex-col sm:flex-row gap-4 bg-gray-300">
          <label className="flex items-center gap-2">
            <p>Sort By: </p>
            <select>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="role">Role</option>
              <option value="created_at">Created At</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <p>Search user</p>
            <Input type="text" />
            <Button>SEARCH</Button>
          </label>
        </div>
        <table className="text-left w-full">
          <thead>
            <tr>
              <th className="px-2 py-1">Email</th>
              <th className="px-2 py-1">Role</th>
              <th className="px-2 py-1 opacity-0">hidden</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => <RoleTableRow key={user._id} user={user} />)}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export async function getServerSideProps() {
  const userRes = await fetch("http://localhost:3000/api/users");
  const users = await userRes.json();

  const projectsRes = await fetch("http://localhost:3000/api/projects");
  const projects = await projectsRes.json();
  return {
    props: { users: users.data, projects: projects.data },
  };
}

export default Index;
