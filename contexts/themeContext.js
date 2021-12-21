import { createContext, useContext } from "react";

const ThemeContext = createContext();

export function ThemeWrapper({ children }) {
  let themeState = {
    info1: "info1",
    info2: "info2",
  };

  return (
    <ThemeContext.Provider value={themeState}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
