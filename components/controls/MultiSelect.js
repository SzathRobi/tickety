import React from "react";
import { useState } from "react/cjs/react.development";
import MultiOption from "./MultiOption";

function MultiSelect({
  headerValue,
  optionsValue,
  canOpen = true,
  onClick = null,
  setTicketDevsAssigned,
  ticketDevsAssigned,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <p
        onClick={canOpen ? () => toggleIsOpen() : null}
        className={canOpen ? "text-black" : "text-gray-400"}
      >
        {headerValue.length === 0
          ? "N/A"
          : headerValue.map((val) => <span key={val}>{`${val}, `}</span>)}
      </p>
      <div
        className={`rounded overflow-hidden
          ${
            isOpen
              ? "border border-gray-800 max-h-max z-50 absolute top-full"
              : "max-h-0"
          }`}
      >
        {optionsValue.map((user) => (
          <MultiOption
            key={user.email}
            user={user}
            onClick={onClick}
            setTicketDevsAssigned={setTicketDevsAssigned}
            ticketDevsAssigned={ticketDevsAssigned}
          />
        ))}
      </div>
    </div>
  );
}

export default MultiSelect;
