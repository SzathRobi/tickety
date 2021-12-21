import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import dbConnect from "../lib/dbConnect";
import "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

function Home({ isConnected }) {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    const data = {
      labels: ["Red", "Blue", "Yellow", "Green"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5],
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
      <div className="w-full p-4 md:pl-20 bg-stone-100">
        <div className="grid gap-y-16 grid-cols-2">
          <div className="w-80">
            <Bar data={data} />
          </div>
          <div className="w-80">
            <Line data={data} />
          </div>
          <div className="w-80">
            <Doughnut data={data} />
          </div>
        </div>
        {isConnected ? (
          <h2 className="subtitle">You are connected to MongoDB</h2>
        ) : (
          <h2 className="subtitle">
            You are NOT connected to MongoDB. Check the <code>README.md</code>{" "}
            for instructions.
          </h2>
        )}
      </div>
    );
  }

  return <a href="/api/auth/login">Login</a>;
}

export async function getServerSideProps(context) {
  try {
    // client.db() will be the default database passed in the MONGODB_URI
    // You can change the database by calling the client.db() function and specifying a database like:
    // const db = client.db("myDatabase");
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands
    await dbConnect();
    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}

export default withPageAuthRequired(Home);
