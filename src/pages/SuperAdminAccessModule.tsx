import { useState, useEffect } from "react";
import { toast } from "sonner";
import axiosInstance from "../utils/axios";
import API_CONSTANTS from "@/utils/apiConstants";

interface Module {
  id: string;
  name: string;
  description: string;
  availableIn: string[];
}

const AccessModules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      setIsLoading(true);
      try {
        const result = await axiosInstance.get(
          API_CONSTANTS.ACCESS_MODULE_SUPER_ADMIN
        );
        const data = result?.data?.data;
        if (data) {
          const transformedModules = [
            {
              id: "1",
              name: "Dashboard",
              description: "Main platform dashboard",
              availableIn: [],
            },
            {
              id: "2",
              name: "Applications",
              description: "Application management",
              availableIn: [],
            },
            {
              id: "3",
              name: "Explore",
              description: "Discover opportunities",
              availableIn: [],
            },
            {
              id: "4",
              name: "Vault",
              description: "Document storage and management",
              availableIn: [],
            },
            {
              id: "5",
              name: "Analytics",
              description: "Data analytics and reporting",
              availableIn: [],
            },
            {
              id: "6",
              name: "SuperAdmin",
              description: "Administrative controls",
              availableIn: [],
            },
          ];

          interface Plan {
            name: string;
            modules: string[];
          }

          interface Module {
            id: string;
            name: string;
            description: string;
            availableIn: string[];
          }

          (data as Plan[]).forEach((plan: Plan) => {
            plan.modules.forEach((moduleName: string) => {
              const module = (transformedModules as Module[]).find(
                (m: Module) => m.name === moduleName
              );
              if (module) {
                module.availableIn.push(plan.name);
              }
            });
          });

          setModules(transformedModules);
        }
      } catch (error) {
        console.error("Error fetching modules: ", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, []);

  const saveModuleConfiguration = () => {
    toast.success("Module configuration saved successfully");
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
              {isError || "Failed to fetch modules"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
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
                className="lucide lucide-settings inline mr-2 h-5 w-5"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Available Modules
            </h3>
            <p className="text-sm text-muted-foreground">
              Configure which features are available in each subscription tier
            </p>
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-6">
            {modules.map((module) => (
              <div key={module.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{module.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {module.availableIn.length} Plans
                    </span>
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                      Configure
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {module.availableIn.map((plan) => (
                    <div
                      key={plan}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <span className="text-sm font-medium">{plan}</span>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          module.availableIn.includes(plan)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      >
                        {module.availableIn.includes(plan) && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6 9 17l-5-5"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              onClick={saveModuleConfiguration}
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
                className="lucide lucide-save mr-2 h-4 w-4"
              >
                <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
                <path d="M7 3v4a1 1 0 0 0 1 1h8"></path>
              </svg>
              Save Module Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessModules;
