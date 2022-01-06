import { useUser } from "@auth0/nextjs-auth0";
import { stringify } from "postcss";
import React from "react";
import { useState } from "react/cjs/react.development";
import Input from "../../components/controls/Input";
import TicketTable from "../../components/table/TicketTable";
import { findObjectsDiffs } from "../../utilities/findObjectsDiffs";
import { formatDate } from "../../utilities/formatDate";
import { updateData } from "../../utilities/updateData";
import Image from "next/image";
import { getBase64 } from "../../utilities/getBase64";
import Button from "../../components/controls/Button";

function Ticket({ ticket }) {
  const { user, error, isLoading } = useUser();

  const [ticketHistory, setTicketHistory] = useState(ticket.history);
  const [history, setHistory] = useState(null);

  const [shouldModify, setShouldModify] = useState(false);

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
  const [ticketFiles, setTicketFiles] = useState(ticket.files);
  const [ticketFile, setTicketFile] = useState({});
  const [ticketFileDesc, setTicketFileDesc] = useState("");
  const updateTicketFileDesc = (event) => setTicketFileDesc(event.target.value);

  const [imgSrc, setImgSrc] = useState("");

  const [ticketChangedData, setTicketChangedData] = useState({});
  const [commentMsg, setCommentMsg] = useState("");

  const [comment, setComment] = useState({
    commenter: user?.nickname,
    msg: "",
  });

  const [commentArr, setCommentArr] = useState(ticket.comments);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    //////    feature - modifie ticket data    ///////////
    const toggleShouldModify = (shouldModify) => {
      setShouldModify(!shouldModify);
      console.log(shouldModify);
    };

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

    const selectImg = (event) => {
      getBase64(event.target.files[0]).then((data) => {
        setImgSrc(data);
      });
      setTicketFile({
        ...ticketFile,
        name: event.target.files[0].name.slice(0, -4),
        fileType: event.target.files[0].name.substring(
          event.target.files[0].name.length - 3
        ),
      });
    };

    const uploadImg = async () => {
      const file = {
        name: ticketFile.name,
        fileType: ticketFile.fileType,
        uploader: user?.nickname || "error",
        url: `${imgSrc}`,
        notes: ticketFileDesc,
      };

      ticketFiles.push(file);

      ticketData = {
        ...ticketData,
        files: ticketFiles,
      };

      updateData(`tickets/${ticket._id}`, ticketData);
    };

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

      setTicketChangedData(findObjectsDiffs(ticket, ticketData));
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

      ticketHistory.push(history);
      console.log("ticketHistory:", ticketHistory);

      ticketData[history] = ticketHistory;

      updateData(`tickets/${ticket._id}`, ticketData);
    };

    ///// feature - add comment to ticket //////

    const updateCommentMsg = (event) => {
      setCommentMsg(event.target.value);
      setComment({ ...comment, msg: commentMsg });
    };

    const addCommentToTicket = async () => {
      commentArr.push(comment);
      const newTicket = { ...ticket, comments: commentArr };

      updateData(`tickets/${ticket._id}`, newTicket);
    };

    return (
      <section className="p-4 md:pl-20 md:py-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/******* DETAILS *******/}
        <div>
          <Button onClick={() => toggleShouldModify(shouldModify)}>
            MODIFY TICKET
          </Button>
          <Button
            onClick={() => saveChanges()}
            className="py-2 px-4 text-white text-sm bg-blue-400 transition-all "
          >
            SAVE CHANGES
          </Button>
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
              <h1>{formatDate(ticket.created_at)}</h1>
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
            <Input
              type="text"
              value={commentMsg}
              onChange={(event) => updateCommentMsg(event)}
            />
            <Button onClick={() => addCommentToTicket()}>ADD COMMENT</Button>
          </div>
          <h2 className="bg-teal-200 p-2 text-xl font-medium">
            Comments for ticket
          </h2>
          <TicketTable
            tableHeaders={["Commenter", "Message", "Created"]}
            tableDatas={ticket.comments}
          />
        </div>
        {/** !!!!!!!!!!!!  TICKET HISTORY TRACKING  !!!!!!!!!!!! */}
        <div>
          <h2 className="bg-teal-200 p-2 text-xl font-medium">
            Ticket History
          </h2>
          <TicketTable
            tableHeaders={[
              "Modifier",
              "Prop",
              "Old Value",
              "New Value",
              "Updated",
            ]}
            tableDatas={ticketHistory}
          />
        </div>
        {/** !!!!!!!!!!!!  TICKET FILES  !!!!!!!!!!!! */}
        <div>
          <div className="mb-4">
            <h3>Add Attachment</h3>
            <div className="flex items-center justify-between">
              <label>
                <p>Select File</p>
                <input
                  type="file"
                  className="p-2 flex gap-2 items-center justify-center bg-gray-500 hover:bg-gray-600 transition-colors text-white text-sm rounded"
                  onChange={(event) => selectImg(event)}
                />
              </label>
              <img src={imgSrc} alt="sg" />
              <label>
                <h6>Add Description</h6>
                <Input
                  type="text"
                  value={ticketFileDesc}
                  onChange={(event) => updateTicketFileDesc(event)}
                />
              </label>
              <Button onClick={() => uploadImg()}>
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
              </Button>
            </div>
          </div>
          <h2 className="bg-teal-200 p-2 text-xl font-medium">
            Ticket Attachments
          </h2>
          <TicketTable
            tableHeaders={["Uploader", "Notes", "File", "Created"]}
            tableDatas={ticket.files}
          />
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

//642ről indult
