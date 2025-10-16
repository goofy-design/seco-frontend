import { useState, useEffect, useRef } from "react";
import Logo from "../assets/seco logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAsync, selectIsLoggedIn } from "./../reudux/slices/authSlice";
import { toast } from "react-toastify";
import type { AppDispatch } from "./../reudux/store";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleResize = () => {
      const isLarge = window.innerWidth >= 1300;
      setIsLargeScreen(isLarge);
      if (isLarge) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      // Close mobile menu if clicked outside
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }

      // Close profile menu if clicked outside
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    // Initial check
    handleResize();

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
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLoggedIn, navigate, dispatch]);

  const handleSignIn = () => {
    navigate("/auth");
    setIsMobileMenuOpen(false);
  };

  const handleSignUp = () => {
    navigate("/auth");
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      navigate("/");
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-40 py-4 px-6 transition-all duration-300 w-full h-20 ${
          isScrolled ? "glass shadow-sm backdrop-blur-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <a className="flex items-center" href="/">
              <img src={Logo} alt="logo" width={32} className="w-20" />
            </a>

            {/* Desktop Navigation */}
            {isLargeScreen && (
              <nav className="flex items-center space-x-8">
                <button
                  type="button"
                  className={`hover:text-foreground transition-all duration-200 relative py-2 flex items-center font-medium after:absolute after:bottom-0 after:bg-primary after:left-0 after:w-full after:h-0.5 ${
                    window.location.pathname === "/" ? "text-primary" : ""
                  }`}
                  onClick={() => navigate("/")}
                >
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
                    className="lucide lucide-house h-4 w-4 mr-2"
                  >
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                  Home
                </button>
                <button
                  type="button"
                  className={`hover:text-foreground transition-all duration-200 relative py-2 flex items-center font-medium after:absolute after:bottom-0 after:bg-primary after:left-0 after:w-full after:h-0.5 ${
                    window.location.pathname === "/events" ? "text-primary" : ""
                  }`}
                  onClick={() => navigate("/events")}
                >
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
                    className="lucide lucide-calendar h-4 w-4 mr-2"
                  >
                    <path d="M8 2v4"></path>
                    <path d="M16 2v4"></path>
                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                    <path d="M3 10h18"></path>
                  </svg>
                  Events
                </button>
                {isLoggedIn && (
                  <button
                    type="button"
                    className={`hover:text-foreground transition-all duration-200 relative py-2 flex items-center font-medium after:absolute after:bottom-0 after:bg-primary after:left-0 after:w-full after:h-0.5 ${
                      window.location.pathname === "/dashboard"
                        ? "text-primary"
                        : ""
                    }`}
                    onClick={() => navigate("/dashboard")}
                  >
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
                      className="lucide lucide-layout-dashboard h-4 w-4 mr-2"
                    >
                      <rect width="7" height="9" x="3" y="3" rx="1" />
                      <rect width="7" height="5" x="14" y="3" rx="1" />
                      <rect width="7" height="9" x="14" y="12" rx="1" />
                      <rect width="7" height="5" x="3" y="16" rx="1" />
                    </svg>
                    Dashboard
                  </button>
                )}
              </nav>
            )}

            {/* Desktop Auth Buttons */}
            {isLargeScreen && (
              <div className="flex items-center space-x-4">
                {!isLoggedIn ? (
                  <>
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      onClick={handleSignIn}
                    >
                      Sign In
                    </button>
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      onClick={handleSignUp}
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    >
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
                        className="lucide lucide-user h-5 w-5"
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
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Profile
                          </a>
                          <a
                            href="/my-events"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            My Events
                          </a>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            {!isLargeScreen && (
              <button
                className="p-2 text-foreground"
                aria-label="Toggle menu"
                onClick={toggleMobileMenu}
              >
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
                >
                  {isMobileMenuOpen ? (
                    <>
                      <path d="M18 6L6 18"></path>
                      <path d="M6 6l12 12"></path>
                    </>
                  ) : (
                    <path d="M4 12h16M4 6h16M4 18h16"></path>
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {!isLargeScreen && isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <div
            ref={mobileMenuRef}
            className="fixed right-0 top-0 h-full w-80 max-w-[80vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <img src={Logo} alt="logo" className="w-16" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
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
                  >
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-6 py-4">
                <div className="space-y-2">
                  <button
                    className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center text-left ${
                      window.location.pathname === "/"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleNavigation("/")}
                  >
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
                      className="h-5 w-5 mr-3"
                    >
                      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    </svg>
                    Home
                  </button>

                  <button
                    className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center text-left ${
                      window.location.pathname === "/events"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleNavigation("/events")}
                  >
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
                      className="h-5 w-5 mr-3"
                    >
                      <path d="M8 2v4"></path>
                      <path d="M16 2v4"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M3 10h18"></path>
                    </svg>
                    Events
                  </button>

                  {isLoggedIn && (
                    <button
                      className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center text-left ${
                        window.location.pathname === "/dashboard"
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleNavigation("/dashboard")}
                    >
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
                        className="h-5 w-5 mr-3"
                      >
                        <rect width="7" height="9" x="3" y="3" rx="1" />
                        <rect width="7" height="5" x="14" y="3" rx="1" />
                        <rect width="7" height="9" x="14" y="12" rx="1" />
                        <rect width="7" height="5" x="3" y="16" rx="1" />
                      </svg>
                      Dashboard
                    </button>
                  )}
                </div>

                {/* User Profile Section for Logged in Users */}
                {isLoggedIn && (
                  <div className="mt-8 pt-6 border-t">
                    <div className="space-y-2">
                      <button
                        className="w-full py-3 px-4 rounded-lg transition-colors flex items-center text-left hover:bg-gray-100"
                        onClick={() => handleNavigation("/profile")}
                      >
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
                          className="h-5 w-5 mr-3"
                        >
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Profile
                      </button>
                      <button
                        className="w-full py-3 px-4 rounded-lg transition-colors flex items-center text-left hover:bg-gray-100"
                        onClick={() => handleNavigation("/my-events")}
                      >
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
                          className="h-5 w-5 mr-3"
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
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full py-3 px-4 rounded-lg transition-colors flex items-center text-left hover:bg-red-50 text-red-600"
                      >
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
                          className="h-5 w-5 mr-3"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16,17 21,12 16,7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </nav>

              {/* Auth Buttons for Non-logged in Users */}
              {!isLoggedIn && (
                <div className="p-6 border-t bg-gray-50">
                  <div className="space-y-3">
                    <button
                      className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      onClick={handleSignIn}
                    >
                      Sign In
                    </button>
                    <button
                      className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      onClick={handleSignUp}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
