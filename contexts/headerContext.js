import { createContext, useContext, useState } from "react";

const HeaderContext = createContext();

export function HeaderWrapper({ children }) {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const toggleOpen = () => setIsNavOpen((isNavOpen) => !isNavOpen);
  /*const [headerState, setHeaderState] = useState({
    isNavOpen: isNavOpen,
    toggleOpen: toggleOpen,
  });*/
  const headerState = {
    isNavOpen: true,
  };

  return (
    <HeaderContext.Provider value={headerState}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeaderContext() {
  return useContext(HeaderContext);
}
