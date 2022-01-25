import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

function TopNavigation({ toggleNavOpen }) {
  const { user, error, isLoading } = useUser();

  return (
    <header className="w-full flex items-center justify-between px-4 py-2 bg-teal-700 text-white fixed top-0 left-0 z-20">
      <div
        className="w-10 md:hidden hover:cursor-pointer"
        onClick={() => toggleNavOpen()}
      >
        <div className="h-1 my-2 rounded-full bg-cyan-50"></div>
        <div className="h-1 my-2 rounded-full bg-cyan-50"></div>
        <div className="h-1 my-2 rounded-full bg-cyan-50"></div>
      </div>
      <h3 className="hidden md:block">TICKETY </h3>
      <nav>
        <ul className="flex items-center gap-4">
          <li className="">
            <Link href="/api/auth/logout">
              <a>Logout</a>
            </Link>
          </li>
          <li className="">Notifications</li>
          <li>Profile</li>
          <li>
            <img src={user?.picture} className="rounded-full h-10"></img>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default TopNavigation;
