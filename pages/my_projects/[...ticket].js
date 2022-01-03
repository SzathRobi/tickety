import { useUser } from "@auth0/nextjs-auth0";
import React from "react";
import { useState } from "react/cjs/react.development";

function Ticket({ ticket }) {
  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  /*!
   * Find the differences between two objects and push to a new object
   * @param  {Object} obj1 The original object
   * @param  {Object} obj2 The object to compare against it
   * @return {Object}      An object of differences between the two
   */
  const diff = function (obj1, obj2) {
    // Make sure an object to compare is provided
    if (!obj2 || Object.prototype.toString.call(obj2) !== "[object Object]") {
      return obj1;
    }

    //
    // Variables
    //

    const diffs = {};
    let key;

    //
    // Methods
    //

    /**
     * Check if two arrays are equal
     * @param  {Array}   arr1 The first array
     * @param  {Array}   arr2 The second array
     * @return {Boolean}      If true, both arrays are equal
     */
    const arraysMatch = function (arr1, arr2) {
      // Check if the arrays are the same length
      if (arr1.length !== arr2.length) return false;

      // Check if all items exist and are in the same order
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
      }

      // Otherwise, return true
      return true;
    };

    /**
     * Compare two items and push non-matches to object
     * @param  {*}      item1 The first item
     * @param  {*}      item2 The second item
     * @param  {String} key   The key in our object
     */
    const compare = function (item1, item2, key) {
      // Get the object type
      const type1 = Object.prototype.toString.call(item1);
      const type2 = Object.prototype.toString.call(item2);

      // If type2 is undefined it has been removed
      if (type2 === "[object Undefined]") {
        diffs[key] = null;
        return;
      }

      // If items are different types
      if (type1 !== type2) {
        diffs[key] = item2;
        return;
      }

      // If an object, compare recursively
      if (type1 === "[object Object]") {
        var objDiff = diff(item1, item2);
        if (Object.keys(objDiff).length > 0) {
          diffs[key] = objDiff;
        }
        return;
      }

      // If an array, compare
      if (type1 === "[object Array]") {
        if (!arraysMatch(item1, item2)) {
          diffs[key] = item2;
        }
        return;
      }

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (type1 === "[object Function]") {
        if (item1.toString() !== item2.toString()) {
          diffs[key] = item2;
        }
      } else {
        if (item1 !== item2) {
          diffs[key] = item2;
        }
      }
    };

    //
    // Compare our objects
    //

    // Loop through the first object
    for (key in obj1) {
      if (obj1.hasOwnProperty(key)) {
        compare(obj1[key], obj2[key], key);
      }
    }

    // Loop through the second object and find missing items
    /* for (key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        diffs[key] = obj2[key];
      }
    }
  }*/

    // Return the object of differences
    return diffs;
  };

  if (user) {
    /////////// feature - ticket history tracking ////////////////
    const [ticketHistory, setTicketHistory] = useState(ticket.history);
    const [history, setHistory] = useState(null);

    //////    feature - modifie ticket data    ///////////

    const [shouldModify, setShouldModify] = useState(false);
    const toggleShouldModify = (shouldModify) => {
      setShouldModify(!shouldModify);
      console.log(shouldModify);
    };

    const [ticketTitle, setTicketTitle] = useState(ticket.title);
    const [ticketDesc, setTicketDesc] = useState(ticket.desc);
    const [ticketSubmitter, setTicketSubmitter] = useState(ticket.submitter);
    const [ticketDevsAssigned, setTicketDevsAssigned] = useState(
      ticket.devs_assigned
    );
    const [ticketPriority, setTicketPriority] = useState(ticket.priority);
    const [ticketStatus, setTicketStatus] = useState(ticket.status);
    const [ticketProject, setTicketProject] = useState(ticket.project);
    const [ticketType, setTicketType] = useState(ticket.type);

    const ticketData = {
      ...ticket,
      title: ticketTitle,
      desc: ticketDesc,
      submitter: ticketSubmitter,
      devs_assigned: ticketDevsAssigned,
      priority: ticketPriority,
      status: ticketStatus,
      project: ticketProject,
      type: ticketType,
    };
    const [ticketChangedData, setTicketChangedData] = useState({});
    const updateTicketData = (event, modifier) => {
      modifier(event.target.value);
      ticketData = {
        ...ticket,
        title: ticketTitle,
        desc: ticketDesc,
        submitter: ticketSubmitter,
        devs_assigned: ticketDevsAssigned,
        priority: ticketPriority,
        status: ticketStatus,
        project: ticketProject,
        type: ticketType,
      };

      setTicketChangedData(diff(ticket, ticketData));
      ///
    };

    const saveChanges = async () => {
      const keys = Object.keys(ticketChangedData);

      let oldValues = keys.map((key) => ticket[key]);
      let newValues = keys.map((key) => ticketData[key]);

      const history = {
        modifier: user?.nickname || "error",
        value_keys: keys,
        old_values: oldValues,
        new_values: newValues,
      };

      //console.log("history:", history);

      ticketHistory.push(history);
      console.log("ticketHistory:", ticketHistory);

      ticketData[history] = ticketHistory;
      console.log("ticketData before PUT", ticketData);
      const modifiedData = await fetch(`/api/tickets/${ticket._id}`, {
        method: "PUT",
        body: JSON.stringify(ticketData),
      });
      const resData = await modifiedData.json();
      console.log(resData);
    };

    ///// feature - add comment to ticket //////
    const [commentMsg, setCommentMsg] = useState("");
    const updateCommentMsg = (event) => {
      setCommentMsg(event.target.value);
      setComment({ ...comment, message: commentMsg });
      console.log("comment:", comment);
    };

    const [comment, setComment] = useState({
      commenter: user?.nickname,
      message: "",
    });

    const [commentArr, setCommentArr] = useState(ticket.comments);

    const addCommentToTicket = async () => {
      commentArr.push(comment);
      const newTicket = { ...ticket, comments: commentArr };
      console.log("newTicket:", newTicket);
      const res = await fetch(`/api/tickets/${ticket._id}`, {
        method: "PUT",
        body: JSON.stringify(newTicket),
      });
      const data = await res.json();
      console.log(data);
    };

    return (
      <section className="p-4 md:pl-20 md:py-6 grid grid-cols-2 gap-4">
        {/******* DETAILS *******/}
        <div>
          <button
            onClick={() => toggleShouldModify(shouldModify)}
            className="py-2 px-4 text-white text-sm bg-blue-600 cursor-pointer transition-all hover:bg-blue-800"
          >
            MODIFY TICKET
          </button>
          <button
            onClick={() => saveChanges()}
            className="py-2 px-4 text-white text-sm bg-blue-400 transition-all "
          >
            SAVE CHANGES
          </button>
          <h2 className="bg-teal-200 mt-2 p-2 text-xl font-medium">
            Details for ticket
          </h2>
          <div className="grid grid-cols-2">
            <div className="p-2 border-b-2 border-gray-400">
              <h3 className="font-medium">Ticket Title</h3>
              <input
                type="text"
                value={ticketTitle}
                onChange={(event) => updateTicketData(event, setTicketTitle)}
                disabled={shouldModify === false}
              />
            </div>
            <div className="p-2 border-b-2 border-gray-400">
              <h3 className="font-medium">Ticket Description</h3>
              <input
                type="text"
                value={ticketDesc}
                onChange={(event) => updateTicketData(event, setTicketDesc)}
                disabled={shouldModify === false}
              />
            </div>
            <div className="p-2 border-b-2 border-gray-400">
              <h3 className="font-medium">Submitter</h3>
              <input
                type="text"
                value={ticket.submitter}
                disabled={shouldModify === false}
              />
            </div>
            <div className="p-2 border-b-2 border-gray-400">
              <h3 className="font-medium">Assigned Developers</h3>
              <h1>{ticket.devs_assigned}</h1>
            </div>
            <div className="p-2 border-b-2 border-gray-400">
              <h3 className="font-medium">Ticket Priority</h3>
              <select
                value={ticketPriority}
                onChange={(event) => updateTicketData(event, setTicketPriority)}
                disabled={shouldModify === false}
                className="appearance-none relative z-0"
              >
                <option selected={ticket.priority === "low"} value="low">
                  Low
                </option>
                <option selected={ticket.priority === "medium"} value="medium">
                  Medium
                </option>
                <option selected={ticket.priority === "high"} value="high">
                  High
                </option>
                <option
                  selected={ticket.priority === "critical"}
                  value="critical"
                >
                  Critical
                </option>
              </select>
            </div>
            <div className="p-2 border-b-2 border-gray-400">
              <h3 className="font-medium">Ticket Status</h3>
              <select
                value={ticketStatus}
                onChange={(event) => updateTicketData(event, setTicketStatus)}
                disabled={shouldModify === false}
                className="appearance-none relative z-0"
              >
                <option selected={ticket.status === "new"} value="new">
                  New
                </option>
                <option selected={ticket.status === "open"} value="open">
                  Open
                </option>
                <option
                  selected={ticket.status === "in_progress"}
                  value="in_progress"
                >
                  In Progress
                </option>
                <option
                  selected={ticket.status === "resolved"}
                  value="resolved"
                >
                  Resolved
                </option>
                <option
                  selected={ticket.status === "additional_info_req"}
                  value="additional_info_req"
                >
                  Additional Info Required
                </option>
              </select>
            </div>
            <div className="p-2 border-b-2 border-gray-400">
              <h3 className="font-medium">Project</h3>
              <h1>{ticket.project}</h1>
            </div>
            <div className="p-2 border-b-2 border-gray-400">
              <h3 className="font-medium">Ticket Type</h3>
              <select
                value={ticketType}
                onChange={(event) => updateTicketData(event, setTicketType)}
                disabled={shouldModify === false}
                className="appearance-none relative z-0"
              >
                <option selected={ticket.type === "bug"} value="bug">
                  Bug/Error
                </option>
                <option
                  selected={ticket.type === "feature_req"}
                  value="feature_req"
                >
                  Feature Request
                </option>
                <option selected={ticket.type === "other"} value="other">
                  Other
                </option>
              </select>
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
        {/** !!!!!!!!!!!!  ADD COMMENT SECTION  !!!!!!!!!!!! */}
        <div>
          <div className="mb-4">
            <h3>Write a comment</h3>
            <input
              type="text"
              value={commentMsg}
              onChange={(event) => updateCommentMsg(event)}
              className="border-2 border-gray-700 rounded mr-2"
            />
            <button
              onClick={() => addCommentToTicket()}
              className="py-2 px-4 text-white text-sm bg-blue-600 cursor-pointer transition-all hover:bg-blue-800"
            >
              ADD COMMENT
            </button>
          </div>
          <h2 className="bg-teal-200 p-2 text-xl font-medium">
            Comments for ticket
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="font-medium p-2">Commenter</th>
                <th className="font-medium p-2">Message</th>
                <th className="font-medium p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {ticket.comments.length === 0 ? (
                <tr>
                  <td></td>
                  <td>Currently No Comments</td>
                  <td></td>
                </tr>
              ) : (
                ticket.comments.map((comm) => (
                  <tr key={comm.message}>
                    <td className="p-2">{comm.commenter}</td>
                    <td className="p-2">{comm.message}</td>
                    <td className="p-2">{comm?.created_at}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/** !!!!!!!!!!!!  TICKET HISTORY TRACKING  !!!!!!!!!!!! */}
        <div>
          <h2 className="bg-teal-200 p-2 text-xl font-medium">
            Ticket History
          </h2>
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="font-medium p-2">Modifier</th>
                <th className="font-medium p-2">Prop</th>
                <th className="font-medium p-2">Old Value</th>
                <th className="font-medium p-2">New Value</th>
                <th className="font-medium p-2">Update Date</th>
              </tr>
            </thead>
            <tbody>
              {ticketHistory.length !== 0 ? (
                ticketHistory.map((his, index) => (
                  <tr key={his._id} className="p-2 border-b-2 border-gray-400">
                    <td className="py-2">{his.modifier}</td>
                    <td className="py-2">
                      {his.value_keys.map((value_key) => (
                        <p key={value_key}>{value_key}</p>
                      ))}
                    </td>
                    <td className="py-2">
                      {his.old_values.map((old_value) => (
                        <p key={old_value}>{old_value}</p>
                      ))}
                    </td>
                    <td className="py-2">
                      {his.new_values.map((new_value) => (
                        <p key={new_value}>{new_value}</p>
                      ))}
                    </td>
                    <td className="py-2">
                      {his.created_at
                        .split(".")[0]
                        .slice(0, -3)
                        .replaceAll("-", ":")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td></td>
                  <td></td>
                  <td>Currently No history</td>
                  <td></td>
                </tr>
              )}
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
          <h2 className="bg-teal-200 p-2 text-xl font-medium">
            Ticket Attachments
          </h2>
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

/* const ticketData = {
      title: ticket.title,
      desc: ticket.desc,
      submitter: ticket.submitter,
      devs_assigned: ticket.devs_assigned,
      priority: ticket.priority,
      status: ticket.status,
      project: ticket.project,
      type: ticket.type,
    };

    const updateTicketData = (event, data) => {
      ticketData[data] = event.target.value;
    };
*/
