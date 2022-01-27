import { useState, useEffect } from "react";
import Button from "../../components/controls/Button";

function Index({ users, projects }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const updateSelectedProject = (event) => {
    setSelectedProject(
      projects.filter((project) => project.name === event.target.value)[0]
    );
  };
  const [avaibleUsers, setAvaibleUsers] = useState(null);
  useEffect(() => {
    const filteredUsers = [];
    users.map((user) => {
      selectedProject?.devs_assigned.some((dev) => user.email === dev.email)
        ? null
        : filteredUsers.push(user);
    });
    selectedProject && setAvaibleUsers(filteredUsers);
  }, [selectedProject]);
  /**/

  const [assignedUsers, setAssignedUsers] = useState(null);

  return (
    <main className="p-4 md:pl-20 pt-20">
      <h1 className="bg-teal-200 mt-2 p-2 text-xl font-medium">
        Manage Project Users
      </h1>
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
                  <tr key={user._id} className="even:bg-gray-200">
                    <td className="px-2 py-1">{user?.email || "none"}</td>
                    <td className="px-2 py-1">
                      {user?.user_metadata?.role || ""}
                    </td>
                    <td className="text-right px-2 py-1">
                      <input type="checkbox" />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Button>ASSIGN USER</Button>
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
              {selectedProject &&
                selectedProject.devs_assigned.map((dev) => (
                  <tr key={dev._id} className="even:bg-gray-200">
                    <td className="px-2 py-1">{dev?.email || dev?.name}</td>
                    <td className="px-2 py-1">{dev?.user_metadata?.role}</td>
                    <td className="text-right px-2 py-1">
                      <input type="checkbox" />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Button>REMOVE USER</Button>
        </div>
      </div>
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
