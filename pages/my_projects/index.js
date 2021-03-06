import { useContext, useEffect, useState } from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Modal from "../../components/modal/Modal";
import MultiSelect from "../../components/select/MultiSelect";
import TableRow from "../../components/table/TableRow";
import UserContext from "../../contexts/userContext";
import { sortArr } from "../../utilities/sortArr";

function Index({ projects = [], users = [] }) {
  const [ismodalOpen, setIsModalOpen] = useState(false);
  const updateModalOpen = () => setIsModalOpen((modalOpen) => !modalOpen);

  const [projectName, setProjectName] = useState("");
  const updateProjectName = (event) => {
    setProjectName(event.target.value);
  };

  const [assignedUsers, setAssignedUsers] = useState([]);

  const { user, error, isLoading } = useUser();

  const [allProjects, setAllProjects] = useState(projects.data);
  const [myProjects, setMyProjects] = useState(
    allProjects.filter((project) =>
      project.devs_assigned.some((dev) => dev.email === user.name)
    )
  );
  const [projectSorter, setProjectSorter] = useState("name");
  useEffect(() => {
    if (myProjects) {
      setMyProjects(sortArr(myProjects, projectSorter));
    }
    if (allProjects) {
      setAllProjects(sortArr(allProjects, projectSorter));
    }
  }, [projectSorter]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    const formData = {
      name: projectName,
      owner: user.name,
      devs_assigned: assignedUsers,
    };
    const createProject = async (event) => {
      event.preventDefault();
      setAllProjects(allProjects.concat(formData));
      console.log(myProjects);
      const res = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      updateModalOpen();
      //console.log(data);
    };

    return (
      <section className="p-4 pt-16 md:pl-20">
        {user && user["https://tickety.vercel.app/role"] === "project_manager" && (
          <button
            onClick={() => updateModalOpen()}
            className="rounded mb-8 py-2 px-4 text-white bg-blue-600 cursor-pointer transition-all hover:bg-blue-800"
          >
            CREATE NEW PROJECT
          </button>
        )}
        <div className="tableContainer">
          <table className="w-full table-auto text-left">
            <thead className="bg-teal-200">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Owner</th>
                <th className="p-4 text-right">
                  <label>
                    Sort By:
                    <select
                      onChange={(event) => setProjectSorter(event.target.value)}
                    >
                      <option value="name">Name</option>
                      <option value="owner">Owner</option>
                    </select>
                  </label>
                </th>
              </tr>
            </thead>
            <tbody>
              {user &&
              user["https://tickety.vercel.app/role"] === "project_manager" ? (
                allProjects.map((project) => (
                  <TableRow key={project.id} project={project} />
                ))
              ) : myProjects.length !== 0 ? (
                myProjects.map((project) => (
                  <TableRow key={project.id} project={project} />
                ))
              ) : (
                <tr>
                  <td>
                    <p className="translate-x-1/3 p-4 text-center mt-4">
                      Currently No Project
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Modal isOpen={ismodalOpen} updateIsOpen={updateModalOpen}>
          <form
            onSubmit={(event) => createProject(event)}
            className="p-4 flex flex-col gap-4 bg-gray-50 rounded shadow-lg"
          >
            <label>
              Project Name:
              <input
                type="text"
                onChange={(event) => updateProjectName(event)}
                className="border rounded"
              />
            </label>
            <MultiSelect
              users={users.data}
              assignedUsers={assignedUsers}
              setAssignedUsers={setAssignedUsers}
            />
            <button type="submit">CREATE</button>
          </form>
        </Modal>
      </section>
    );
  }
}

export async function getServerSideProps(context) {
  const projectRes = await fetch(
    `${process.env?.SITE_URL}/api/projects` ||
      "http://localhost:3000/api/projects",
    {
      method: "GET",
    }
  );
  const projects = await projectRes.json();

  const usersRes = await fetch(
    `${process.env?.SITE_URL}/api/users` || "http://localhost:3000/api/users"
  );
  const users = await usersRes.json();

  return {
    props: { projects, users },
  };
}

export default withPageAuthRequired(Index);
