import "../styles/globals.css";
import { UserProvider } from "@auth0/nextjs-auth0";
import { HeaderWrapper } from "../contexts/headerContext";
import TopNavigation from "../components/navs/TopNavigation";
import SideNavigation from "../components/navs/SideNavigation";
import { useState } from "react/cjs/react.development";

function MyApp({ Component, pageProps }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNavOpen = () => {
    setIsNavOpen((isNavOpen) => !isNavOpen);
    console.log(isNavOpen);
  };

  return (
    <UserProvider>
      <HeaderWrapper>
        <TopNavigation toggleNavOpen={toggleNavOpen} />
        <SideNavigation isNavOpen={isNavOpen} />
      </HeaderWrapper>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
