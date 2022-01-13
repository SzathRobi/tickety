import { useUser } from "@auth0/nextjs-auth0";
import { stringify } from "postcss";
import React, { useEffect } from "react";
import { useState } from "react/cjs/react.development";
import Input from "../../components/controls/Input";
import TicketTable from "../../components/table/TicketTable";
import { findObjectsDiffs } from "../../utilities/findObjectsDiffs";
import { formatDate } from "../../utilities/formatDate";
import { updateData } from "../../utilities/updateData";
import Image from "next/image";
import { getBase64 } from "../../utilities/getBase64";
import Button from "../../components/controls/Button";
import Modal from "../../components/modal/Modal";
import Select from "../../components/controls/Select";
import Option from "../../components/controls/Option";
import MultiSelect from "../../components/controls/MultiSelect";
function Ticket({ ticket, users, project }) {
  // console.log("project:", project);
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

  //console.log("user:", user);
  const [comment, setComment] = useState({
    commenter: "",
    msg: "",
    created_at: "",
  });

  const [commentArr, setCommentArr] = useState(ticket.comments);

  const [fileModalOpen, setFileModalOpen] = useState(false);
  const toggleFileModalOpen = () => setFileModalOpen(!fileModalOpen);
  const [actualFile, setActualFile] = useState({});
  const openFileModal = (file) => {
    setActualFile(file);
    toggleFileModalOpen();
  };

  useEffect(() => {
    console.log(ticketDevsAssigned);
  }, [ticketDevsAssigned]);

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

    const updateTicketData = (
      event,
      modifier,
      devs = null,
      state = null,
      willRemove = false
    ) => {
      willRemove ? null : modifier([...state, devs] || event.target.value);
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
      console.log("ticketData:", ticketData);

      /******************************************************************************/

      /**Put if here to check obj / (arr diffs => create changeObj with arr values)**/
      //  OR NOT  //
      /******************************************************************************/

      setTicketChangedData(findObjectsDiffs(ticket, ticketData));
      console.log("ticketChangedData: ", ticketChangedData);
      ///
    };

    const addDevs = (dev) => {
      setTicketDevsAssigned(ticketDevsAssigned.concat(dev));
      //console.log("ticketDevsAssigned:", ticketDevsAssigned);
    };

    //dev = user.email
    const removeDevs = (dev) => {
      const filteredList = ticketDevsAssigned.filter(
        (actualDev) => actualDev !== dev
      );
      //console.log("filteredList:", filteredList);
      setTicketDevsAssigned(filteredList);
      //console.log("ticketDevsAssigned on remove:", ticketDevsAssigned);
    };

    const saveChanges = async () => {
      const keys = Object.keys(ticketChangedData);
      console.log("keys:", keys);

      let oldValues = keys.map((key) => ticket[key]);
      let newValues = keys.map((key) => ticketData[key]);

      const history = {
        modifier: user?.nickname || "error",
        value_keys: keys,
        old_values: oldValues,
        new_values: newValues,
      };

      setTicketHistory(ticketHistory.concat(history));
      console.log("ticketHistory:", ticketHistory);

      ticketData[history] = ticketHistory;

      console.log("ticketData: ", ticketData);
      updateData(`tickets/${ticket._id}`, ticketData);
    };

    ///// feature - add comment to ticket //////

    const updateCommentMsg = (event) => {
      const date = new Date();
      setCommentMsg(event.target.value);
      setComment({
        ...comment,
        commenter: user.nickname,
        msg: commentMsg,
        created_at: date.toISOString(),
      });
    };

    const addCommentToTicket = async () => {
      //setComment({ ...comment, created_at: Date.now() });
      console.log(comment);
      setCommentArr(commentArr.concat(comment));
      const newTicket = { ...ticket, comments: commentArr };
      console.log();
      // updateData(`tickets/${ticket._id}`, newTicket);
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
              <Input
                type="text"
                value={ticketTitle}
                onChange={(event) => updateTicketData(event, setTicketTitle)}
                disabled={shouldModify === false}
              />
            </div>
            <div className="p-2 border-b-2 border-gray-400">
              <h3 className="font-medium">Ticket Description</h3>
              <Input
                type="text"
                value={ticketDesc}
                onChange={(event) => updateTicketData(event, setTicketDesc)}
                disabled={shouldModify === false}
              />
            </div>
            <div className="p-2 border-b-2 border-gray-400">
              <h3 className="font-medium">Submitter</h3>
              <Input
                type="text"
                value={ticket.submitter}
                disabled={shouldModify === false}
              />
            </div>
            <div className="p-2 border-b-2 border-gray-400">
              <h3 className="font-medium">Assigned Developers</h3>
              <MultiSelect
                headerValue={ticketDevsAssigned}
                optionsValue={project[0].devs_assigned}
                canOpen={shouldModify}
                onClick={{ addDevs, removeDevs, updateTicketData }}
                setTicketDevsAssigned={setTicketDevsAssigned}
                ticketDevsAssigned={ticketDevsAssigned}
              />
            </div>
            <div className="p-2 border-b-2 border-gray-400">
              <h3 className="font-medium">Ticket Priority</h3>
              <Select
                value={ticketPriority}
                defaultValue={ticketPriority}
                onChange={(event) => updateTicketData(event, setTicketPriority)}
                disabled={shouldModify === false}
              >
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
                <Option value="critical">Critical</Option>
              </Select>
            </div>
            <div className="p-2 border-b-2 border-gray-400">
              <h3 className="font-medium">Ticket Status</h3>
              <Select
                value={ticketStatus}
                onChange={(event) => updateTicketData(event, setTicketStatus)}
                disabled={shouldModify === false}
              >
                <Option value="new">New</Option>
                <Option value="open">Open</Option>
                <Option value="in_progress">In Progress</Option>
                <Option value="resolved">Resolved</Option>
                <Option value="additional_info_req">
                  Additional Info Required
                </Option>
              </Select>
            </div>
            <div className="p-2 border-b-2 border-gray-400">
              <h3 className="font-medium">Project</h3>
              <h1>{ticket.project}</h1>
            </div>
            <div className="p-2 border-b-2 border-gray-400">
              <h3 className="font-medium">Ticket Type</h3>
              <Select
                value={ticketType}
                onChange={(event) => updateTicketData(event, setTicketType)}
                disabled={shouldModify === false}
              >
                <Option value="bug">Bug/Error</Option>
                <Option value="feature_req">Feature Request</Option>
                <Option value="other">Other</Option>
              </Select>
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
            tableDatas={commentArr}
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
            onClick={(file) => openFileModal(file)}
          />
        </div>
        <Modal isOpen={fileModalOpen} updateIsOpen={toggleFileModalOpen}>
          <div>
            <h1>ACTUAL FILE</h1>
            <h2>{actualFile.name}</h2>
            <img src={actualFile.url} height="300" />
          </div>
        </Modal>
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

  const usersRes = await fetch("http://localhost:3000/api/users", {
    method: "GET",
  });
  const users = await usersRes.json();

  const projectRes = await fetch(
    `http://localhost:3000/api/projects/${ticket.data.project}`
  );
  const project = await projectRes.json();

  return {
    props: { ticket: ticket.data, users: users.data, project: project.data },
  };
}

export default Ticket;

//642ről indult
