import React from "react";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { formatDate } from "../../utilities/formatDate";
function Index({ tickets = [] }) {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    const myTickets = tickets.filter((ticket) =>
      ticket.devs_assigned.includes(user.name)
    );
    console.log(myTickets);
    return (
      <main className="p-4 md:pl-20 pt-20">
        <h1 className="bg-teal-200 mt-2 p-2 text-xl font-medium">
          Tickets assigned to me
        </h1>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-300">
              <th className="font-medium p-2">Title</th>
              <th className="font-medium p-2">Devs</th>
              <th className="font-medium p-2">Created At</th>
              <th className="font-medium p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {myTickets.map((myTicket) => (
              <tr
                key={myTicket._id}
                className="p-2 border-b-2 border-gray-400 transition-colors
                cursor-pointer hover:bg-gray-200"
              >
                <td className="py-2 max-w-xs">{myTicket.title}</td>
                <td className="py-2 max-w-xs">
                  {myTicket.devs_assigned.map((dev) => (
                    <p key={dev}>{dev}</p>
                  ))}
                </td>
                <td className="py-2 max-w-xs">
                  {formatDate(myTicket.created_at)}
                </td>
                <td className="py-2 max-w-xs">
                  <Link
                    href={`/my_projects/${myTicket.project}/${myTicket._id}`}
                  >
                    <a className="w-8 flex items-center gap-1 p-1 rounded text-white text-sm bg-cyan-600 transition-all hover:bg-cyan-800">
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
            ))}
          </tbody>
        </table>
      </main>
    );
  }
}

export async function getServerSideProps() {
  const ticketRes = await fetch("http://localhost:3000/api/tickets", {
    method: "GET",
  });

  const tickets = await ticketRes.json();

  return {
    props: { tickets: tickets.data },
  };
}

export default Index;
