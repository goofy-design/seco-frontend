import "@/App.css";

// react router imports
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { setNavigate } from "./utils/navigateHelper";

// auth import
import { OAuthCallback } from "./utils/OAuthCallback";
import { selectIsLoggedIn } from "./reudux/slices/authSlice";

// pages import
import Home from "@/components/Home";
import LoginSignUp from "@/components/LoginSignUp";
import EventDashboard from "@/pages/EventDashboard";
import CreateEvent from "@/pages/CreateEvent";
import MyEvents from "@/pages/MyEvents";
import Applications from "./pages/Applications";
import EventDetails from "@/pages/EventDetails";
import Account from "@/pages/Account";
import Judge from "./pages/Judge";
import Layout from "@/Layout";
// import UnderConstruction from "./pages/UnderConstruction";
import Vault from "./pages/Vault";
import ApplyEvent from "./pages/ApplyEvent";
import EventResponses from "./pages/JudgeManagementSystem";
import ApplicationDetailsWrapper from "./pages/ApplicationDetailsWrapper";
import Dashboard from "./pages/Dashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminUsers from "./pages/SuperAdminUsers";
import SuperAdminEvents from "./pages/SuperAdminEvents";
import SuperAdminSettings from "./pages/SuperAdminSettings";
import SuperAdminSystemLogs from "./pages/SuperAdminSystemLogs";
import SuperAdminAnalyticsDashboard from "./pages/SuperAdminAnalyticsDashboard";
import SuperAdminSubscriptionManagement from "./pages/SuperAdminSubscriptionManagement";
import Investor from "./pages/Investor";
import ManageEvent from "./pages/ManageEvent";
import SharedFoldersView from "./components/SharedFoldersView";

const AppWrapper: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  return null; // This component only sets up navigation globally
};

const App = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <>
      <Router>
        <AppWrapper />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/judge/:eventId/:judgeId" element={<Judge />} />
          <Route
            path="/t1"
            element={
              <SharedFoldersView
                sharedFolderIds={[
                  "8a039c86-9407-4f99-9046-64be3f87f894",
                  "1a1aa334-b29e-4ed5-8f06-e23ad5eb69e8",
                ]}
              />
            }
          />
          <Route path="/auth" element={<LoginSignUp />} />
          <Route path="/test" element={<ApplyEvent />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />

          {isLoggedIn ? (
            <Route
              path="*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/events" element={<EventDashboard />} />
                    <Route path="/event" element={<CreateEvent />} />
                    <Route path="/event/manage/:id" element={<ManageEvent />} />
                    <Route path="/event/:id" element={<CreateEvent />} />
                    <Route path="/my-events" element={<MyEvents />} />
                    <Route path="/applications" element={<Applications />} />
                    <Route
                      path="/applications/:id"
                      element={<ApplicationDetailsWrapper />}
                    />

                    <Route path="/vault" element={<Vault />} />
                    <Route path="/register/:eventId" element={<ApplyEvent />} />
                    <Route path="/responses/:id" element={<EventResponses />} />
                    <Route path="/event/view/:id" element={<EventDetails />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/investor" element={<Investor />} />
                    <Route path="/profile" element={<Account />} />
                    <Route
                      path="/super-admin"
                      element={<SuperAdminDashboard />}
                    />
                    <Route
                      path="/super-admin/users"
                      element={<SuperAdminUsers />}
                    />
                    <Route
                      path="/super-admin/events"
                      element={<SuperAdminEvents />}
                    />
                    <Route
                      path="/super-admin/settings"
                      element={<SuperAdminSettings />}
                    />
                    <Route
                      path="/super-admin/logs"
                      element={<SuperAdminSystemLogs />}
                    />
                    <Route
                      path="/super-admin/analytics"
                      element={<SuperAdminAnalyticsDashboard />}
                    />
                    <Route
                      path="/super-admin/subscriptions"
                      element={<SuperAdminSubscriptionManagement />}
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </Layout>
              }
            />
          ) : (
            <>
              <Route path="/events" element={<EventDashboard />} />
              <Route path="/event/view/:id" element={<EventDetails />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Toaster richColors position="top-center" />
    </>
  );
};

export default App;
