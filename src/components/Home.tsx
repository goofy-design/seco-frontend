import Footer from "./Footer";
import GetStarted from "./GetStarted";
import Header from "./Header";
import Hero from "./Hero";
import HostDiscover from "./HostDiscover";
import Testimonial from "./Testimonial";
import Tools from "./Tools";
import UpcomingEvents from "./UpcomingEvents";

const Home = () => {
  return (
    <div className="flex flex-col">
      <Header />
      <Hero />
      <Tools />
      <UpcomingEvents />
      <HostDiscover />
      <Testimonial />
      <GetStarted />
      <Footer />
    </div>
  );
};

export default Home;
