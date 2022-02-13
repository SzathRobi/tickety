import UserContext from "../../contexts/userContext";
import { useState } from "react";

function UserWrapper({ children }) {
  const [dbUser, setDbUser] = useState({});

  return (
    <UserContext.Provider value={{ dbUser, setDbUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserWrapper;
