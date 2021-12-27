import React from "react";

function Ticket({ ticket }) {
  return (
    <section className="p-4 md:pl-20 md:py-6 grid grid-cols-2 gap-4">
      {/******* DETAILS *******/}
      <div>
        <h2 className="bg-teal-200 p-2 text-xl font-medium">
          Details for ticket
        </h2>
        <div className="grid grid-cols-2">
          <div className="p-2 border-b-2 border-gray-400">
            <h3 className="font-medium">Ticket Title</h3>
            <h1>{ticket.title}</h1>
          </div>
          <div className="p-2 border-b-2 border-gray-400">
            <h3 className="font-medium">Ticket Description</h3>
            <h1>{ticket.desc}</h1>
          </div>
          <div className="p-2 border-b-2 border-gray-400">
            <h3 className="font-medium">Submitter</h3>
            <h1>{ticket.submitter}</h1>
          </div>
          <div className="p-2 border-b-2 border-gray-400">
            <h3 className="font-medium">Assigned Developers</h3>
            <h1>{ticket.devs_assigned}</h1>
          </div>
          <div className="p-2 border-b-2 border-gray-400">
            <h3 className="font-medium">Ticket Priority</h3>
            <h1>{ticket.priority}</h1>
          </div>
          <div className="p-2 border-b-2 border-gray-400">
            <h3 className="font-medium">Ticket Status</h3>
            <h1>{ticket.status}</h1>
          </div>
          <div className="p-2 border-b-2 border-gray-400">
            <h3 className="font-medium">Project</h3>
            <h1>{ticket.project}</h1>
          </div>
          <div className="p-2 border-b-2 border-gray-400">
            <h3 className="font-medium">Ticket Type</h3>
            <h1>{ticket.type}</h1>
          </div>
          <div className="p-2 border-b-2 border-gray-400">
            <h3 className="font-medium">Created</h3>
            <h1>{ticket.created_at}</h1>
          </div>
          <div className="p-2 border-b-2 border-gray-400">
            <h3 className="font-medium">Updated</h3>
            <h1>{ticket?.updated}</h1>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-4">
          <h3>Write a comment</h3>
          <input
            type="text"
            className="border-2 border-gray-700 rounded mr-2"
          />
          <button className="py-2 px-4 text-white text-sm bg-blue-600 cursor-pointer transition-all hover:bg-blue-800">
            ADD COMMENT
          </button>
        </div>
        <h2 className="bg-teal-200 p-2 text-xl font-medium">
          Comments for ticket
        </h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-medium p-2">Commenter</th>
              <th className="font-medium p-2">Message</th>
              <th className="font-medium p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td>Currently No Comments</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="bg-teal-200 p-2 text-xl font-medium">Ticket History</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-medium p-2">Property</th>
              <th className="font-medium p-2">Old Value</th>
              <th className="font-medium p-2">New Value</th>
              <th className="font-medium p-2">Update Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td>Currently No history</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <div className="mb-4">
          <h3>Add Attachment</h3>
          <div className="flex items-center justify-between">
            <label>
              <p>Select File</p>
              <button className="p-2 flex gap-2 items-center justify-center bg-gray-500 hover:bg-gray-600 transition-colors text-white text-sm rounded">
                <span>UPLOAD FILE</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </button>
            </label>
            <label>
              <h6>Add Description</h6>
              <input type="text" />
              <button className="py-2 px-4 text-white text-sm bg-blue-600 cursor-pointer transition-all hover:bg-blue-800">
                ADD DESCRIPTION
              </button>
            </label>
          </div>
        </div>
        <h2 className="bg-teal-200 p-2 text-xl font-medium">Ticket History</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-medium p-2">File</th>
              <th className="font-medium p-2">Uploader</th>
              <th className="font-medium p-2">Notes</th>
              <th className="font-medium p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td>Currently No Files</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export async function getServerSideProps({ params }) {
  const id = params.ticket[1];
  const ticketRes = await fetch(`http://localhost:3000/api/tickets/${id}`, {
    method: "GET",
  });
  const ticket = await ticketRes.json();

  return {
    props: { ticket: ticket.data },
  };
}

export default Ticket;
