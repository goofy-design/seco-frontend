const GetStarted = () => {
  return (
    <div>
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-secondary/10 rounded-2xl p-8 md:p-12 text-center animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to accelerate your startup journey?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of founders and investors who are building the
              future with Seco Discover.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8">
                Get Started for Free
              </button>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 rounded-md px-8">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetStarted;
