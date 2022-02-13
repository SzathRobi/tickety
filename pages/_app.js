import "../styles/globals.css";
import { UserProvider } from "@auth0/nextjs-auth0";
import { HeaderWrapper } from "../contexts/headerContext";
import UserWrapper from "../components/wrappers/UserWrapper";
import TopNavigation from "../components/navs/TopNavigation";
import SideNavigation from "../components/navs/SideNavigation";
import { useState } from "react";

function MyApp({ Component = null, pageProps = null }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNavOpen = () => {
    setIsNavOpen((isNavOpen) => !isNavOpen);
    console.log(isNavOpen);
  };

  return (
    <UserProvider>
      <UserWrapper>
        <HeaderWrapper>
          <TopNavigation toggleNavOpen={toggleNavOpen} />
          <SideNavigation isNavOpen={isNavOpen} />
        </HeaderWrapper>
        <Component {...pageProps} />
      </UserWrapper>
    </UserProvider>
  );
}

export default MyApp;
