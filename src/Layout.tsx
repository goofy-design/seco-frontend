import { useEffect, useState, useRef } from "react";
// import Sidebar from "./components/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutAsync, selectIsLoggedIn } from "./reudux/slices/authSlice";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "./reudux/store";
import { selectUser } from "./reudux/slices/authSlice";
import Logo from "./assets/seco logo.png";
import axiosInstance from "./utils/axios";
import API_CONSTANTS from "./utils/apiConstants";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const firstName = user?.name?.split(" ")[0];

  const sidebarRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const checkAdminStatus = async () => {
    if (!user?.id) return;
    
    try {
      const response = await axiosInstance.post(API_CONSTANTS.CHECK_ADMIN_USER, {
        id: user.id
      });
      console.log("respone: ", response?.data?.data?.isAdmin);
      setIsAdmin(response?.data?.data || false);
    } catch (error) {
      console.error("Failed to check admin status:", error);
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      navigate("/");
      setIsProfileMenuOpen(false);
      setIsSidebarOpen(false);
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (!isLargeScreen) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      if (!isLoggedIn) {
        navigate("/auth");
      }
    };
    checkAuth();

    // Check admin status when user is available
    if (user?.id) {
      checkAdminStatus();
    }

    const handleResize = () => {
      const isLarge = window.innerWidth >= 1300;
      setIsLargeScreen(isLarge);

      // Auto-open sidebar on large screens, close on small screens
      if (isLarge) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      // Close sidebar if clicked outside on mobile
      if (
        !isLargeScreen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        const target = event.target as HTMLElement;
        // Don't close if clicking the toggle button
        if (!target.closest('[data-sidebar="trigger"]')) {
          setIsSidebarOpen(false);
        }
      }

      // Close profile menu if clicked outside
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === "user" && !e.newValue) {
        try {
          await dispatch(logoutAsync()).unwrap();
          navigate("/");
        } catch (error: any) {
          console.error("Logout error in storage change:", error);
          toast.error("Failed to sync logout state. Please sign out manually.");
          navigate("/");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLoggedIn, navigate, dispatch, isLargeScreen, user?.id]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const baseSidebarItems = [
    // {
    //   label: "Home",
    //   path: "/",
    //   icon: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       width="20"
    //       height="20"
    //       viewBox="0 0 24 24"
    //       fill="none"
    //       stroke="currentColor"
    //       strokeWidth="2"
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //       className="h-5 w-5"
    //     >
    //       <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
    //       <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    //     </svg>
    //   ),
    // },
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
    },
    {
      label: "Events",
      path: "/events",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
          <path d="M3 10h18"></path>
        </svg>
      ),
    },
    {
      label: "My Events",
      path: "/my-events",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
          <path d="M3 10h18"></path>
        </svg>
      ),
    },
    {
      label: "Create Event",
      path: "/event",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l4 4 4-4" />
        </svg>
      ),
    },
    {
      path: "/applications",
      label: "Applications",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
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
    //       width="34"
    //       height="34"
    //       viewBox="0 0 24 24"
    //       fill="none"
    //       stroke="currentColor"
    //       stroke-width="2"
    //       stroke-linecap="round"
    //       stroke-linejoin="round"
    //       className="icon icon-tabler icons-tabler-outline icon-tabler-gavel h-4 w-4"
    //     >
    //       <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    //       <path d="M13 10l7.383 7.418c.823 .82 .823 2.148 0 2.967a2.11 2.11 0 0 1 -2.976 0l-7.407 -7.385" />
    //       <path d="M6 9l4 4" />
    //       <path d="M13 10l-4 -4" />
    //       <path d="M3 21h7" />
    //       <path d="M6.793 15.793l-3.586 -3.586a1 1 0 0 1 0 -1.414l2.293 -2.293l.5 .5l3 -3l-.5 -.5l2.293 -2.293a1 1 0 0 1 1.414 0l3.586 3.586a1 1 0 0 1 0 1.414l-2.293 2.293l-.5 -.5l-3 3l.5 .5l-2.293 2.293a1 1 0 0 1 -1.414 0z" />
    //     </svg>
    //   ),
    // },
    {
      path: "/investor",
      label: "Investor",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-user-group"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Vault",
      path: "/vault",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <circle cx="12" cy="16" r="1" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
  ];

  const superAdminItem = {
    label: "Super Admin",
    path: "/super-admin",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-database"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v6c0 1.657 4.03 3 9 3s9-1.343 9-3V5" />
        <path d="M3 11v6c0 1.657 4.03 3 9 3s9-1.343 9-3v-6" />
      </svg>
    ),
  };

  const sidebarItems = isAdmin ? [...baseSidebarItems, superAdminItem] : baseSidebarItems;

  const CustomSidebar = () => (
    <div className="h-full flex flex-col bg-white">
      {/* Logo Section */}
      <div className="p-6 border-b pb-[14px]">
        <div className="flex items-center">
          {/* <h2 className="text-xl font-bold text-gray-900">seco</h2> */}
          <img src={Logo} alt="logo" width={32} className="w-20" />
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Profile Section */}
        <div className="space-y-1">
          <button
            onClick={() => handleNavigation("/profile")}
            className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/profile"
                ? "bg-primary/10 text-primary"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 mr-3"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 mr-3"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Sign Out
          </button>
        </div>
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen relative">
      {/* Desktop Sidebar */}
      {isLargeScreen && (
        <div
          className={`transition-all duration-300 ${
            isSidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0"
          } overflow-hidden`}
        >
          <div className={`${isSidebarOpen ? "block" : "hidden"}`}>
            <CustomSidebar />
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {!isLargeScreen && isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <div
            ref={sidebarRef}
            className="fixed left-0 top-0 h-full w-64 max-w-[80vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
          >
            <div className="h-full flex flex-col">
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-auto">
                <CustomSidebar />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Toggle Button */}
        <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-9 w-9 p-2"
              data-sidebar="trigger"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isLargeScreen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-300 ${
                    isSidebarOpen ? "rotate-180" : ""
                  }`}
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                  <path d="M9 4v16" />
                  <path d="M14 10l2 2l-2 2" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12h16M4 6h16M4 18h16"></path>
                </svg>
              )}
            </button>

            {/* Breadcrumb or Page Title */}
            {/* <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            </div> */}
          </div>

          {/* Right Side - Profile Menu */}
          <div className="flex items-center gap-4">
            {/* Debug info - remove in production */}
            <span className="hidden lg:inline text-sm text-gray-500">
              {isLoggedIn ? firstName : "Not Logged In"}
            </span>

            {isLoggedIn && (
              <div className="relative" ref={profileMenuRef}>
                <button
                  className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  aria-label="User menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        role="menuitem"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                          >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          Profile
                        </div>
                      </a>
                      <a
                        href="/my-events"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        role="menuitem"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                          >
                            <path d="M8 2v4"></path>
                            <path d="M16 2v4"></path>
                            <rect
                              width="18"
                              height="18"
                              x="3"
                              y="4"
                              rx="2"
                            ></rect>
                            <path d="M3 10h18"></path>
                          </svg>
                          My Events
                        </div>
                      </a>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                          >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16,17 21,12 16,7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </svg>
                          Sign Out
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 lg:p-8 p-4 overflow-auto bg-gray-50">
          <div className="max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
