import { useEffect, useState } from "react";
import API_CONSTANTS from "../utils/apiConstants";
import axiosInstance from "../utils/axios";
import { toast } from "sonner";
import React from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  updated_at?: string;
}

// Utility hook for click outside
function useClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  onClose: () => void
) {
  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClose]);
}

const SuperAdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const deleteModalRef = React.useRef<HTMLDivElement>(null);
  const userModalRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(deleteModalRef, () => {
    if (showDeleteModal) {
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  });
  useClickOutside(userModalRef, () => {
    if (showUserModal) {
      setShowUserModal(false);
      setSelectedUser(null);
      setUserForm({
        name: "",
        email: "",
        role: "user",
        password: "",
        status: "active",
      });
    }
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(
          API_CONSTANTS.GET_ALL_USERS_SUPER_ADMIN
        );
        let data = res?.data?.data;
        if (!Array.isArray(data)) {
          data = [];
        }
        setUsers(data);
      } catch {
        setError("Failed to fetch users data");
        toast.error("Failed to fetch users data");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await axiosInstance.delete(`/super-admin/delete-user`, {
        data: { id: selectedUser.id },
      });
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
      toast.success("User deleted successfully");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleSaveUser = async () => {
    try {
      if (isEditMode && selectedUser) {
        // Edit user
        const payload = {
          id: selectedUser.id,
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          status: userForm.status,
          password: userForm.password,
        };
        if (userForm.password) {
          payload.password = await hashPassword(userForm.password);
        }
        await axiosInstance.post(`/super-admin/edit-user`, payload);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id
              ? { ...u, ...userForm, password: undefined }
              : u
          )
        );
        toast.success("User updated successfully");
      } else {
        // Add user
        if (!userForm.password) {
          throw new Error("Password is required for new user");
        }
        const hashedPassword = await hashPassword(userForm.password);
        await axiosInstance.post(API_CONSTANTS.SIGNUP, {
          ...userForm,
          password: hashedPassword,
        });
        const response = await axiosInstance.get(
          API_CONSTANTS.GET_ALL_USERS_SUPER_ADMIN
        );
        let data = response?.data?.data;
        if (!Array.isArray(data)) {
          data = [];
        }
        setUsers(data);
        toast.success("User created successfully");
      }
      setShowUserModal(false);
      setUserForm({
        name: "",
        email: "",
        role: "user",
        password: "",
        status: "active",
      });
      setSelectedUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(
        isEditMode ? "Failed to update user" : "Failed to create user"
      );
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRole("");
    setSelectedStatus("");
    setActiveTab("all");
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "" || user.status === selectedStatus;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "admins" && user.role === "admin") ||
      (activeTab === "pending" && user.status === "pending");
    return matchesSearch && matchesRole && matchesStatus && matchesTab;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-lg font-semibold">Loading users...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">{error}</div>
          <div className="text-gray-500">Please try again later.</div>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-500 text-lg font-semibold mb-2">
            No users found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container py-6 md:py-8 max-w-6xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/super-admin">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10">
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
                    className="lucide lucide-arrow-left h-4 w-4"
                  >
                    <path d="m12 19-7-7 7-7"></path>
                    <path d="M19 12H5"></path>
                  </svg>
                </button>
              </a>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  User Management
                </h1>
                <p className="text-muted-foreground">
                  Manage all users in the system
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-red-100 text-red-800">
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
                  className="lucide lucide-shield w-3 h-3 mr-1"
                >
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                </svg>{" "}
                SuperAdmin
              </div>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                Admin User
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-2">
                <h3 className="tracking-tight text-sm font-medium">
                  Total Users
                </h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">{users.length}</div>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-2">
                <h3 className="tracking-tight text-sm font-medium">Active</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold text-green-600">
                  {users.filter((user) => user.status === "active").length}
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-2">
                <h3 className="tracking-tight text-sm font-medium">Pending</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold text-yellow-600">
                  {users.filter((user) => user.status === "pending").length}
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-2">
                <h3 className="tracking-tight text-sm font-medium">Blocked</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold text-red-600">
                  {users.filter((user) => user.status === "blocked").length}
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-2">
                <h3 className="tracking-tight text-sm font-medium">
                  Admin Users
                </h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold text-blue-600">
                  {users.filter((user) => user.role === "admin").length}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div
                role="tablist"
                aria-orientation="horizontal"
                className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
                tabIndex={0}
                data-orientation="horizontal"
                style={{ outline: "none" }}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "all"}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "all"
                      ? "bg-background text-foreground shadow-sm"
                      : ""
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  All Users
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "admins"}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "admins"
                      ? "bg-background text-foreground shadow-sm"
                      : ""
                  }`}
                  onClick={() => setActiveTab("admins")}
                >
                  Admins
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "pending"}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "pending"
                      ? "bg-background text-foreground shadow-sm"
                      : ""
                  }`}
                  onClick={() => setActiveTab("pending")}
                >
                  Pending
                </button>
              </div>
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setShowUserModal(true);
                  setUserForm({
                    name: "",
                    email: "",
                    role: "user",
                    password: "",
                    status: "active",
                  });
                }}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
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
                  className="lucide lucide-user-plus mr-2 h-4 w-4"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="19" x2="19" y1="8" y2="14"></line>
                  <line x1="22" x2="16" y1="11" y2="11"></line>
                </svg>
                Add User
              </button>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex-1 max-w-md">
                    <input
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full"
                      placeholder="Search users by name, email, or role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">
                        Role
                      </span>
                      <select
                        className="border rounded px-2 py-1 text-xs"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                        <option value="">All Roles</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="judge">Judge</option>
                        <option value="organizer">Organizer</option>
                        <option value="superadmin">Superadmin</option>
                        <option value="founder">Founder</option>
                        <option value="reviewer">Reviewer</option>
                        <option value="investor">Investor</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">
                        Status
                      </span>
                      <select
                        className="border rounded px-2 py-1 text-xs"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 mt-3"
                      onClick={resetFilters}
                    >
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
                        className="lucide lucide-filter mr-1 h-3 w-3"
                      >
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                      Reset
                    </button>
                  </div>
                </div>
                <div
                  role="tabpanel"
                  aria-labelledby="radix-:rm:-trigger-all"
                  id="radix-:rm:-content-all"
                  tabIndex={0}
                  className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 m-0"
                >
                  <div className="overflow-x-auto">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                              Name
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                              Email
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                              Role
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                              Status
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                              Last Login
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[_tr:last-child]:border-0">
                          {filteredUsers.length === 0 ? (
                            <tr>
                              <td
                                colSpan={6}
                                className="text-center py-8 text-gray-500"
                              >
                                No users found matching your criteria
                              </td>
                            </tr>
                          ) : (
                            filteredUsers.map((user) => (
                              <tr
                                key={user.id}
                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                              >
                                <td className="p-6 align-middle flex items-center gap-2">
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
                                    className="lucide lucide-user h-4 w-4 text-muted-foreground"
                                  >
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                  </svg>
                                  {user.name}
                                </td>
                                <td className="p-4 align-middle">
                                  {user.email}
                                </td>
                                <td className="p-4 align-middle">
                                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                                    {user.role}
                                  </div>
                                </td>
                                <td className="p-4 align-middle">
                                  <div
                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground ${
                                      user.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : user.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : user.status === "blocked"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-secondary text-secondary-foreground"
                                    }`}
                                  >
                                    {user.status}
                                  </div>
                                </td>
                                <td className="p-4 align-middle">
                                  {user.updated_at || "Never"}
                                </td>
                                <td className="p-4 align-middle">
                                  <div className="flex space-x-2">
                                    <button
                                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setIsEditMode(true);
                                        setUserForm({
                                          name: user.name,
                                          email: user.email,
                                          role: user.role,
                                          status: user.status,
                                          password: "",
                                        });
                                        setShowUserModal(true);
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 h-9 rounded-md px-3 text-red-500 hover:text-red-700 hover:bg-red-100"
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setShowDeleteModal(true);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div
                  role="tabpanel"
                  aria-labelledby="radix-:rm:-trigger-admins"
                  id="radix-:rm:-content-admins"
                  tabIndex={0}
                  className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 m-0"
                ></div>
                <div
                  role="tabpanel"
                  aria-labelledby="radix-:rm:-trigger-pending"
                  id="radix-:rm:-content-pending"
                  tabIndex={0}
                  className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 m-0"
                ></div>
              </div>
              <div className="items-center flex justify-between border-t p-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredUsers.length} of {users.length} users
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                    Previous
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            ref={deleteModalRef}
            className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg"
          >
            <div className="mb-4 text-lg font-semibold">
              Are you sure you want to delete this user?
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            ref={userModalRef}
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
          >
            <div className="mb-4 text-lg font-semibold">
              {isEditMode ? "Edit User" : "Add New User"}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Name"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border rounded px-3 py-2 pr-10"
                    placeholder="Password"
                    value={userForm.password}
                    onChange={(e) =>
                      setUserForm((f) => ({ ...f, password: e.target.value }))
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
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
                        <path d="m9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" y1="2" x2="22" y2="22" />
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
                        className="lucide lucide-eye"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, role: e.target.value }))
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                  <option value="judge">Judge</option>
                  <option value="organizer">Organizer</option>
                  <option value="founder">Founder</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="investor">Investor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={userForm.status}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, status: e.target.value }))
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setShowUserModal(false);
                  setUserForm({
                    name: "",
                    email: "",
                    role: "user",
                    password: "",
                    status: "active",
                  });
                  setSelectedUser(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleSaveUser}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminUsers;
