const Discover = () => {
  return (
    <>
      <div className="h-16 border-b px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-7 w-7"
            data-sidebar="trigger"
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
              className="lucide lucide-panel-left"
            >
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6">
        <h1 className="text-2xl font-bold">Discover</h1>
      </div>
    </>
  );
};

export default Discover;
