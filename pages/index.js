import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import Link from "next/link";
import dbConnect from "../lib/dbConnect";
import "chart.js/auto";
import InfoCard from "../components/dashboard/InfoCard";
import { useContext, useEffect } from "react";
import UserContext from "../contexts/userContext";
//import { ticketStatusData } from "../utilities/chartDatas";

/**
 * use myUser for role checking, auth0 fucked up with metadata
 */

function Home({ tickets = [], users = [] }) {
  const { user, error, isLoading } = useUser();
  console.log("auth_user:", user);
  const { dbUser, setDbUser } = useContext(UserContext);
  //console.log(user);
  //console.log(tickets);
  const myUser = users.find((dbUser) => dbUser.email === user.name);
  useEffect(() => {
    setDbUser(myUser);
  }, [user]);

  const sentTicketsByMe = tickets.filter(
    (ticket) => ticket.submitter === user.nickname
  );

  const assignedTickets = tickets.filter((ticket) =>
    ticket.devs_assigned.includes(user.name)
  );

  console.log("assignedTickets:", assignedTickets);

  //Tickets By Priority
  const lowTickets = tickets.filter((ticket) => ticket.priority === "low");
  const mediumTickets = tickets.filter(
    (ticket) => ticket.priority === "medium"
  );
  const highTickets = tickets.filter((ticket) => ticket.priority === "high");
  const criticalTickets = tickets.filter(
    (ticket) => ticket.priority === "critical"
  );

  //Tickets By Status
  const newTickets = tickets.filter((ticket) => ticket.status === "new");
  const openTickets = tickets.filter((ticket) => ticket.status === "open");
  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "in_progress"
  );
  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "resolved"
  );
  const needMoreInfoTickets = tickets.filter(
    (ticket) => ticket.status === "additional_info_req"
  );

  //Tickets By Types
  const bugTickets = tickets.filter((ticket) => ticket.type === "bug/error");
  const featureTickets = tickets.filter(
    (ticket) => ticket.type === "feature_req"
  );
  const otherTickets = tickets.filter((ticket) => ticket.type === "other");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    const ticketStatusData = {
      labels: ["New", "Open", "In Progress", "Resolved", "Need Extra Info"],
      datasets: [
        {
          label: "# Tickets By Status",
          data: [
            newTickets.length,
            openTickets.length,
            inProgressTickets.length,
            resolvedTickets.length,
            needMoreInfoTickets.length,
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(175, 112, 200, 0.8)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(175, 112, 200, )",
          ],
          borderWidth: 1,
        },
      ],
    };

    const ticketTypesData = {
      labels: ["Bug/Error", "Feature Req", "Other"],
      datasets: [
        {
          label: "Tickets By Types",
          data: [bugTickets.length, featureTickets.length, otherTickets.length],
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const ticketPriorityData = {
      labels: ["low", "medium", "High", "Critical"],
      datasets: [
        {
          label: "# Tickets By Priority",
          data: [
            lowTickets.length,
            mediumTickets.length,
            highTickets.length,
            criticalTickets.length,
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    return (
      <section className="min-h-screen w-full p-4 pt-20 md:pl-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          <InfoCard
            text={
              myUser?.user_metadata?.role === "submitter"
                ? "Tickets That Need More Info"
                : myUser?.user_metadata?.role === "developer"
                ? "Tickets Assigned To Me"
                : myUser?.user_metadata?.role === "project_manager"
                ? "Tickets That Need More Info"
                : "Tickets That Need More Info"
            }
            data={
              myUser?.user_metadata?.role === "submitter"
                ? needMoreInfoTickets.length
                : myUser?.user_metadata?.role === "developer"
                ? assignedTickets.length
                : myUser?.user_metadata?.role === "project_manager"
                ? needMoreInfoTickets.length
                : needMoreInfoTickets.length
            }
          />
          <InfoCard
            text={
              myUser?.user_metadata?.role === "submitter"
                ? "Sent Tickets By Me"
                : myUser?.user_metadata?.role === "developer"
                ? "Critical tickets"
                : myUser?.user_metadata?.role === "project_manager"
                ? "New Tickets"
                : "New Tickets"
            }
            data={
              myUser?.user_metadata?.role === "submitter"
                ? sentTicketsByMe.length
                : myUser?.user_metadata?.role === "developer"
                ? assignedTickets.length
                : myUser?.user_metadata?.role === "project_manager"
                ? newTickets.length
                : newTickets.length
            }
          />
          <InfoCard text="Total Tickets" data={tickets.length} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 justify-items-center gap-12 mb-8">
          <div className="col-span-1 w-full md:w-96 flex flex-col justify-between shadow-lg shadow-gray-500 rounded-md p-4 gap-4">
            <p className="text-center">Ticket By Status</p>
            <Pie data={ticketStatusData} />
          </div>
          <div className="col-span-1 w-full md:w-96 flex flex-col justify-between shadow-lg shadow-gray-500 rounded-md p-4 gap-4">
            <p className="text-center">Tickets By Priority</p>
            <Doughnut data={ticketPriorityData} />
          </div>
        </div>
        <div className="w-full sm:w-2/3 flex flex-col justify-between mx-auto shadow-lg shadow-gray-500 rounded-md p-4">
          <p className="text-center">Tickets By Types</p>
          <Bar data={ticketTypesData} />
        </div>
      </section>
    );
  }

  return <Link href="/api/auth/login">Login</Link>;
}

export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const ticketRes = await fetch("http://localhost:3000/api/tickets");
    const tickets = await ticketRes.json();
    const userRes = await fetch("http://localhost:3000/api/users");
    const users = await userRes.json();
    return {
      props: { tickets: tickets.data, users: users.data },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { fuckedUp: true },
    };
  }
}

export default withPageAuthRequired(Home);
