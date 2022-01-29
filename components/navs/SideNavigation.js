import Link from "next/link";

function SideNavigation({ isNavOpen }) {
  return (
    <aside
      className={`bg-teal-800 h-full text-white transition-all duration-300 pt-20 fixed z-10 top-0 md:-left-32 hover:md:-left-0 ${
        isNavOpen ? "left-0" : "-left-60"
      }`}
    >
      <nav>
        <ul>
          <li className="hover:cursor-pointer my-3 p-4 transition-all duration-300 hover:bg-teal-900">
            <Link href="/">
              <a className="flex justify-between items-center gap-6">
                <span className="flex-1">Dashboard</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
              </a>
            </Link>
          </li>
          <li className="flex justify-between items-center gap-6 hover:cursor-pointer my-3 p-4 transition-all duration-300 hover:bg-teal-900">
            <Link href="/manage_users">
              <a className="flex justify-between items-center gap-6">
                <span className="flex-1">Manage Users</span>{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </a>
            </Link>
          </li>
          <li className="hover:cursor-pointer my-3 p-4 transition-all duration-300 hover:bg-teal-900">
            <Link href="/my_projects">
              <a className="flex justify-between items-center gap-6">
                <span className="flex-1">My Projects</span>{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </a>
            </Link>
          </li>
          <li className="hover:cursor-pointer my-3 p-4 transition-all duration-300 hover:bg-teal-900">
            <Link href="/my_tickets">
              <a className="flex justify-between items-center gap-4">
                <span className="flex-1">My Tickets</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default SideNavigation;
