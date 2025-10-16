import Header from "./Header";

const Suspence = ({
  children,
  isLoading,
  showHeader = false,
  isError
}: {
  children: React.ReactNode;
  isLoading: boolean;
  showHeader?: boolean;
  isError: boolean;
}) => {
  if (isLoading) {
    return (
      <div>
        {showHeader && <Header />}
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
        {showHeader && <Header />}
        <div className="mt-16 pt-4">
          <div className="container mx-auto py-8 px-4">
            <div className="text-center text-red-500">
              {isError || "Event not found"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default Suspence;
