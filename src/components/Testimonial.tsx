const Testimonial = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What our users say
          </h2>
          <p className="text-muted-foreground text-lg">
            Hear from startups and investors who have found success with Seco
            Discover.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow animate-fade-in">
            <div className="flex flex-col space-y-1.5 p-6">
              <svg
                className="h-8 w-8 text-primary/60 mb-4"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
              </svg>
              <h3 className="text-2xl font-semibold leading-none tracking-tight sr-only">
                Testimonial
              </h3>
              <p className="text-foreground text-lg">
                Seco Discover helped us connect with the perfect accelerator
                program for our startup. We've since raised $2M in funding!
              </p>
            </div>
            <div className="p-6 flex items-center pt-4">
              <img
                src="https://randomuser.me/api/portraits/women/1.jpg"
                alt="Photo of Sarah Johnson"
                className="h-10 w-10 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">
                  Founder, TechVision
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow animate-fade-in">
            <div className="flex flex-col space-y-1.5 p-6">
              <svg
                className="h-8 w-8 text-primary/60 mb-4"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
              </svg>
              <h3 className="text-2xl font-semibold leading-none tracking-tight sr-only">
                Testimonial
              </h3>
              <p className="text-foreground text-lg">
                As an investor, I've found incredible startups through this
                platform. The matching algorithm really understands what I'm
                looking for.
              </p>
            </div>
            <div className="p-6 flex items-center pt-4">
              <img
                src="https://randomuser.me/api/portraits/men/2.jpg"
                alt="Photo of Michael Chang"
                className="h-10 w-10 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-medium">Michael Chang</p>
                <p className="text-sm text-muted-foreground">Angel Investor</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow animate-fade-in">
            <div className="flex flex-col space-y-1.5 p-6">
              <svg
                className="h-8 w-8 text-primary/60 mb-4"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
              </svg>
              <h3 className="text-2xl font-semibold leading-none tracking-tight sr-only">
                Testimonial
              </h3>
              <p className="text-foreground text-lg">
                The event management tools saved us countless hours when
                organizing our pitch competition. Highly recommended!
              </p>
            </div>
            <div className="p-6 flex items-center pt-4">
              <img
                src="https://randomuser.me/api/portraits/women/3.jpg"
                alt="Photo of Alicia Rodriguez"
                className="h-10 w-10 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-medium">Alicia Rodriguez</p>
                <p className="text-sm text-muted-foreground">
                  Program Director, Launch Incubator
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
