import { useState, useEffect } from "react";
import { X, MapPin, User, Building2, Mail } from "lucide-react";
import axiosInstance from "./../utils/axios";
import API_CONSTANTS from "./../utils/apiConstants";

interface InvestorType {
  id: string;
  company_description: string | null;
  company_name: string | null;
  website: string | null;
  avatar_url: string | null;
  location: string | null;
  industry: string | null;
  full_name: string | null;
  showInvestors: boolean;
  availability: string | null;
  bio: string | null;
  sectors: string[] | null;
  expertise: string[] | null;
  specialization: string | null;
  experience: string | null;
  linkedin: string | null;
  email: string | null;
  role: string | null;
}

const Investor = () => {
  const [investors, setInvestors] = useState<InvestorType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorType | null>(
    null
  );
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("Grid");

  useEffect(() => {
    const fetchInvestors = async () => {
      setIsLoading(true);
      try {
        const result = await axiosInstance(API_CONSTANTS.GET_ALL_INVESTORS);
        const data = result?.data?.investors;
        if (data) {
          setInvestors(data);
        }
      } catch (error) {
        console.error("Error fetching investors: ", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  useEffect(() => {
    console.log("Investors updated: ", investors);
    console.log("Filtered investors: ", filteredInvestors);
  }, [investors]);

  // Filter investors based on search term
  const filteredInvestors = investors.filter((investor) => {
    if (!investor || !investor.full_name) return false;
    return (
      (investor.full_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (investor.company_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (investor.sectors || []).some((sector) =>
        (sector || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  const openViewModal = (investor: InvestorType) => {
    setSelectedInvestor(investor);
    setShowViewModal(true);
  };

  const closeModal = () => {
    setShowViewModal(false);
    setSelectedInvestor(null);
  };

  if (isLoading) {
    return (
      <div>
        <div className="mt-16 pt-4">
          <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="mt-16 pt-4">
          <div className="container mx-auto py-8 px-4">
            <div className="text-center text-red-500">
              {isError || "Investor not found"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="">
        <div className="max-w-7xl mx-auto px-6 py-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl animate-gradient-x">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Professional Directory
            </h1>
            <p className="text-gray-600">
              Connect with industry professionals, mentors, judges, and experts
              to help grow your startup
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, company, sector, expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Filters and View Toggle */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("Grid")}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    viewMode === "Grid"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("List")}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    viewMode === "List"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  List
                </button>
              </div>
              <span className="text-sm text-gray-500">
                Showing {filteredInvestors.length} professionals
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white max-w-7xl mx-auto px-6 py-8">
        {viewMode === "Grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvestors.map((investor) => (
              <div
                key={investor?.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
              >
                <div className="p-6 flex flex-col h-full">
                  {/* Profile Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {investor?.avatar_url ? (
                        <img
                          src={investor?.avatar_url}
                          alt={investor?.full_name || ""}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {investor?.full_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {investor?.company_name}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        investor?.role === "Investor"
                          ? "bg-blue-100 text-blue-800"
                          : investor?.role === "Judge"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {investor?.role
                        ? investor.role.charAt(0).toUpperCase() +
                          investor.role.slice(1)
                        : "N/A"}
                    </span>
                  </div>

                  {/* Location and Availability */}
                  {investor.location && (
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{investor?.location || "N/A"}</span>
                    </div>
                  )}

                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        investor?.availability === "Available"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {investor?.availability === "Available"
                        ? "Available for Meetings"
                        : "Unavailable"}
                    </span>
                  </div>

                  {/* Sectors */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Sectors
                    </p>
                    {investor?.sectors && investor.sectors.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {(investor?.sectors || [])
                          .slice(0, 3)
                          .map((sector, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                            >
                              {sector || "N/A"}
                            </span>
                          ))}
                      </div>
                    ) : (
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <span>No sectors available</span>
                      </div>
                    )}
                  </div>

                  {/* Expertise */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Expertise
                    </p>
                    {investor?.expertise && investor.expertise.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {(investor?.expertise || [])
                          .slice(0, 2)
                          .map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              {skill || "N/A"}
                            </span>
                          ))}
                      </div>
                    ) : (
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <span>No expertise available</span>
                      </div>
                    )}
                  </div>

                  {/* Specialization */}
                  <div className="mb-6">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Specialization
                    </p>
                    <p className="text-xs text-gray-500">
                      {investor?.specialization ||
                        "No specialization available"}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 mt-auto">
                    <button
                      onClick={() => openViewModal(investor)}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Details
                    </button>
                    {/* <button
                      onClick={() => {}}
                      className="w-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Connect
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View with horizontal scroll on small screens
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Professional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sectors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvestors.map((investor) => (
                  <tr key={investor?.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {investor?.avatar_url ? (
                          <img
                            src={investor.avatar_url}
                            alt={investor?.full_name || ""}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {investor?.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {investor?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {investor?.company_name || "Not Available"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          investor?.role === "Investor"
                            ? "bg-blue-100 text-blue-800"
                            : investor?.role === "Judge"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {investor?.role
                          ? investor.role.charAt(0).toUpperCase() +
                            investor.role.slice(1)
                          : "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(investor?.sectors || []).slice(0, 2).join(", ") ||
                        "Sectors Not Available"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          investor?.availability === "Available"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {investor?.availability || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openViewModal(investor)}
                        className="bg-blue-600 text-white px-2 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredInvestors.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No professionals found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>

      {/* View Investor Modal */}
      {showViewModal && selectedInvestor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="relative px-6 py-4 border-b border-gray-200">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                Professional Details
              </h2>
              <p className="text-sm text-gray-500">
                View and connect with this professional
              </p>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Profile Section */}
              <div className="text-center mb-8">
                {selectedInvestor?.avatar_url ? (
                  <img
                    src={selectedInvestor.avatar_url}
                    alt={selectedInvestor?.full_name || ""}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedInvestor.full_name}
                </h3>
                <p className="text-lg text-gray-600 mb-2">
                  {selectedInvestor.company_name}
                </p>
                <span
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                    selectedInvestor.role === "Investor"
                      ? "bg-blue-100 text-blue-800"
                      : selectedInvestor.role === "Judge"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {selectedInvestor.role
                    ? selectedInvestor.role.charAt(0).toUpperCase() +
                      selectedInvestor.role.slice(1)
                    : "N/A"}
                </span>
                <div className="flex items-center justify-center mt-3 text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {selectedInvestor.location || "N/A"}
                  </span>
                </div>
                <div className="mt-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                      selectedInvestor.availability === "Available"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedInvestor.availability === "Available"
                      ? "Available for Meetings"
                      : "Unavailable"}
                  </span>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Bio
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedInvestor.bio || "No bio available"}
                </p>
              </div>

              {/* Experience */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Experience
                </h4>
                <div className="flex items-center text-gray-700">
                  <Building2 className="w-5 h-5 mr-2 text-gray-400" />
                  <span>{selectedInvestor.experience || "Not Specified"}</span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Sectors */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Sectors
                  </h4>
                  {selectedInvestor.sectors &&
                  selectedInvestor.sectors.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {(selectedInvestor.sectors || []).map((sector, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium"
                        >
                          {sector || "N/A"}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium">
                        Sector Not Available
                      </span>
                    </div>
                  )}
                </div>

                {/* Expertise */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Expertise
                  </h4>
                  {selectedInvestor.expertise &&
                  selectedInvestor.expertise.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {(selectedInvestor.expertise || []).map(
                        (skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium"
                          >
                            {skill || "N/A"}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                        Not Specified
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Specialization */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Specialization
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    {selectedInvestor.specialization || "Not Specified"}
                  </p>
                </div>
              </div>

              {/* Contact Links */}
              {(selectedInvestor.email ||
                selectedInvestor.linkedin ||
                selectedInvestor.website) && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Contact
                  </h4>
                  <div className="space-y-3">
                    {selectedInvestor.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <a
                          href={`mailto:${selectedInvestor.email || ""}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {selectedInvestor.email || "N/A"}
                        </a>
                      </div>
                    )}
                    {selectedInvestor.linkedin && (
                      <div className="flex items-center space-x-3">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        <a
                          href={selectedInvestor.linkedin || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {selectedInvestor.linkedin ? "LinkedIn" : "N/A"}
                        </a>
                      </div>
                    )}
                    {selectedInvestor.website && (
                      <div className="flex items-center space-x-3">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                        </svg>
                        <a
                          href={selectedInvestor.website || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {selectedInvestor.website ? "Website" : "N/A"}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investor;
