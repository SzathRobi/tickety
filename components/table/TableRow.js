import Link from "next/link";

function TableRow({ project }) {
  const deleteProject = async () => {
    console.log("see me?");
    const res = await fetch("/api/projects", {
      method: "DELETE",
      body: {
        name: project.name,
      },
    });
  };
  return (
    <tr key={project.name} className="border-b-4 border-stone-400">
      <td className="p-4">{project.name}</td>
      <td className="p-4">{project.owner}</td>
      <td className="flex justify-end items-center gap-4 p-4 text-right">
        <Link href={`/my_projects/${project.name}`}>
          <a className="flex items-center gap-1 p-2 rounded text-white text-sm bg-cyan-600 transition-all hover:bg-cyan-800">
            <span>DETAILS </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
  );
}

export default TableRow;
