import { useState } from "react";

function MultiOption({
  user,
  onClick,
  setTicketDevsAssigned,
  ticketDevsAssigned,
}) {
  const [checked, setChecked] = useState(
    ticketDevsAssigned.includes(user.email)
  );
  const handleChange = (dev, checked) => {
    setChecked((checked) => !checked);
    // console.log("checked:", checked);
    // checked ? console.log("will REMOVE") : console.log("will ADD");
    checked ? onClick.removeDevs(dev) : onClick.addDevs(dev);
  };
  return (
    <label
      key={user.email}
      className="p-2 flex items-center justify-between gap-2 bg-white hover:bg-gray-200 transition-colors cursor-pointer"
    >
      <p>{user.email}</p>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => handleChange(user.email, checked)}
      />
    </label>
  );
}

export default MultiOption;
