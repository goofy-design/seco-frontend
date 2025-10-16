import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "@/assets/seco logo.png";

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      if (!user) {
        navigate("/");
      }
    };
    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      // @ts-ignore
      if (e.key !== "user") {
        navigate("/");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const menuItems = [
    // {
    //   path: "/",
    //   label: "Home",
    //   icon: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       width="24"
    //       height="24"
    //       viewBox="0 0 24 24"
    //       fill="none"
    //       stroke="currentColor"
    //       strokeWidth="2"
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //       className="lucide lucide-house h-4 w-4"
    //     >
    //       <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
    //       <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    //     </svg>
    //   ),
    // },
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-layout-dashboard h-4 w-4"
        >
          <rect width="7" height="9" x="3" y="3" rx="1"></rect>
          <rect width="7" height="5" x="14" y="3" rx="1"></rect>
          <rect width="7" height="9" x="14" y="12" rx="1"></rect>
          <rect width="7" height="5" x="3" y="16" rx="1"></rect>
        </svg>
      ),
    },
    {
      path: "/events",
      label: "Events",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-calendar h-4 w-4"
        >
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
          <path d="M3 10h18"></path>
        </svg>
      ),
    },
    {
      path: "/my-events",
      label: "My Events",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-clipboard h-4 w-4"
        >
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        </svg>
      ),
    },
    {
      path: "/event",
      label: "Create Event",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-plus-circle h-4 w-4"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 12h8"></path>
          <path d="M12 8v8"></path>
        </svg>
      ),
    },
    {
      path: "/profile",
      label: "Account",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-user h-4 w-4"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
    {
      path: "/applications",
      label: "Applications",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-user h-4 w-4"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
    // {
    //   path: "/judge",
    //   label: "Judge",
    //   icon: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       width="24"
    //       height="24"
    //       viewBox="0 0 24 24"
    //       fill="none"
    //       stroke="currentColor"
    //       stroke-width="2"
    //       stroke-linecap="round"
    //       stroke-linejoin="round"
    //       className="lucide lucide-user h-4 w-4"
    //     >
    //       <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    //       <circle cx="12" cy="7" r="4"></circle>
    //     </svg>
    //   ),
    // },
    {
      path: "/vault",
      label: "Vault",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-folder-open h-5 w-5"
          data-lov-id="src/pages/dashboard/DashboardRoot.tsx:26:62"
          data-lov-name="FolderOpen"
          data-component-path="src/pages/dashboard/DashboardRoot.tsx"
          data-component-line="26"
          data-component-file="DashboardRoot.tsx"
          data-component-name="FolderOpen"
          data-component-content="%7B%22className%22%3A%22h-5%20w-5%22%7D"
        >
          <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path>
        </svg>
      ),
    },
  ];

  // Function to check if a route is active, including dynamic routes
  const isRouteActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    // For dynamic routes like /events/edit/:id
    if (path === "/events") {
      return (
        location.pathname.startsWith("/events") &&
        !location.pathname.startsWith("/events/edit")
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className="group/sidebar-wrapper flex has-[[data-variant=inset]]:bg-sidebar"
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
    >
      <div className="flex min-h-screen">
        <div
          className="group peer hidden md:block text-sidebar-foreground"
          data-state="expanded"
          data-collapsible=""
          data-variant="sidebar"
          data-side="left"
        >
          <div className="duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180 group-data-[collapsible=icon]:w-[--sidebar-width-icon]"></div>
          <div className="duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l bg-white">
            <div
              data-sidebar="sidebar"
              className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
            >
              <div data-sidebar="header" className="flex flex-col gap-2 p-4">
                <div className="flex items-center">
                  <Link to="/" className="flex items-center">
                    <img src={Logo} alt="logo" width={32} className="w-20" />
                  </Link>
                </div>
              </div>
              <div
                data-sidebar="content"
                className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden p-4"
              >
                <ul
                  data-sidebar="menu"
                  className="flex w-full min-w-0 flex-col gap-1"
                >
                  {menuItems.map((item) => (
                    <li
                      key={item.path}
                      data-sidebar="menu-item"
                      className="group/menu-item relative"
                    >
                      <Link
                        to={item.path}
                        className={`peer/menu-button flex w-full items-center overflow-hidden p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm gap-4 ${
                          isRouteActive(item.path)
                            ? "bg-accent font-medium text-sidebar-accent-foreground rounded"
                            : ""
                        }`}
                        data-sidebar="menu-button"
                        data-size="default"
                        data-active={isRouteActive(item.path)}
                        data-state="closed"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
