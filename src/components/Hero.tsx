const Hero = () => {
  return (
    <section className="relative pt-16 pb-20 overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
            Connecting Startups with Opportunities
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl mb-6 animate-fade-in">
            Find the perfect <span className="text-gradient">accelerator</span>,{" "}
            <span className="text-gradient">investor</span>, or{" "}
            <span className="text-gradient">event</span> for your startup
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-8 animate-fade-in">
            Seco Discover connects founders with the resources they need to
            succeed. Find events, connect with investors, and join a thriving
            community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8">
              Get Started
            </button>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 rounded-md px-8">
              Explore Events
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 w-full max-w-3xl animate-fade-in">
            <div className="flex flex-col items-center p-4 rounded-xl glass">
              <div className="text-2xl md:text-3xl font-bold">2,500+</div>
              <div className="text-muted-foreground text-sm">
                Active Startups
              </div>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl">
              <div className="text-2xl md:text-3xl font-bold">850+</div>
              <div className="text-muted-foreground text-sm">Investors</div>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl glass">
              <div className="text-2xl md:text-3xl font-bold">1,200+</div>
              <div className="text-muted-foreground text-sm">Events Hosted</div>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl">
              <div className="text-2xl md:text-3xl font-bold">500+</div>
              <div className="text-muted-foreground text-sm">
                Success Stories
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
