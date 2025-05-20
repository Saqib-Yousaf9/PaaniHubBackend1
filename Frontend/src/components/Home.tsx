import React, { useEffect } from "react";
import n from "./image/n.jpg";
import abc from "./image/abc.jpeg";
import abcd from "./image/abcd.jpeg";
import abcde from "./image/abcde.jpeg";
import water from "./videos/water.mp4"; // Assuming you have a video
import logo from "./image/logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const drinkingWaterImage =
  "https://th.bing.com/th/id/R.26ac2666f1ac3949b529b2db5aef3e93?rik=fldbp4sFPN65ug&pid=ImgRaw&r=0";
const waterTankerImage =
  "https://cdn.sanity.io/images/8v1ince6/production/3cd7bba3020261d7823d7feafb5010f979b3fb1c-1600x1200.jpg";
const swimmingPoolWaterImage =
  "https://purebluepools.co.uk/wp-content/uploads/2024/08/swimming-pool-water-hd.webp";
const constructionWaterImage =
  "https://dutronindia.com/wp-content/uploads/3.jpg";
const agriculturalWaterImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVSi0eDwtOsvs3FiliRhFAIVSv0ccAo_osrQ&s";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const slideInElement = document.querySelector(".slide-left") as HTMLElement;
    const fadeInElement = document.querySelector(".fade-in") as HTMLElement;

    if (slideInElement) {
      slideInElement.style.transform = "translateX(0)";
    }

    if (fadeInElement) {
      fadeInElement.style.opacity = "1";
    }
  }, []);

  return (
    <div className="w-full h-full">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 via-white to-blue-600 text-white p-4 fixed w-full top-0 left-0 z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo and Brand Name */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="PaaniHub Logo" className="h-12 w-23" />{" "}
            <div className="text-3xl font-bold black">PaaniHub</div>
          </div>

          <div className="space-x-4">
            <Link
              to="/auth/login"
              className="px-5 py-2 bg-white text-blue-700 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Video */}
      <section
        className="relative text-center mt-16 bg-black"
        style={{
          height: "100vh", // Full viewport height
          backgroundColor: "black",
          overflow: "hidden",
        }}
      >
        <video
          src={water}
          autoPlay
          loop
          muted
          playsInline
          className=" absolute top-0 left-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className=" text-4xl  md:text-6xl font-bold slide-left transform translate-x-full transition-transform duration-700 ">
            WELCOME TO PAANIHUB
          </h1>
          <p className="text-xl md:text-3xl fade-in opacity-0 transition-opacity duration-700 mt-4">
            Your reliable water delivery service.
          </p>
          <Link
            to="/auth/register"
            className="mt-6 px-6 py-3 bg-blue-700 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors duration-300"
          >
            Register Now
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-10 bg-gray-50 relative">
        <h2 className="mb-4 text-3xl font-semibold text-blue-600 text-center">
          About Us
        </h2>
        <div className="relative py-4 px-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 ">
          {" "}
          {/* Increased gap from 6 to 12 */}
          {/* Left Side: Large Image */}
          <div className="pr-12  pt-7">
            {" "}
            {/* Added padding-right to increase space between image and text */}
            <img
              src={abc}
              alt="About Us Image"
              className="w-full h-auto object-cover shadow-lg"
            />
          </div>
          {/* Right Side: Content and Two More Images */}
          <div className="pl-12 pt-6">
            {" "}
            {/* Added padding-left for better spacing */}
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              Welcome to PaaniHub, your reliable partner in water delivery
              services. We are committed to providing the highest quality water
              solutions to meet the diverse needs of our customers.
            </p>
            <p className="text-lg leading-relaxed text-gray-700 mb-5">
              Our mission is to offer safe, clean, and sustainable water
              delivery services to households, businesses, and industries. We
              pride ourselves on customer-centric services, putting the needs of
              our clients first.
            </p>
            {/* Sub-grid for two smaller images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-7">
              <div>
                <img
                  src={abcd}
                  alt="Service Image 1"
                  className="w-43 h-auto object-cover shadow-lg"
                />
              </div>
              <div>
                <img
                  src={abcde}
                  alt="Service Image 2"
                  className="w-full h-auto object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        id="services"
        className="py-12 bg-gradient-to-r from-white to-blue-50 text-center"
      >
        <h2 className="mb-6 text-4xl font-semibold text-blue-700">
          Our Services
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            {
              image: drinkingWaterImage,
              title: "Drinking Water",
              description:
                "Fresh and clean drinking water delivered to your doorstep.",
              price: "$20",
            },
            {
              image: waterTankerImage,
              title: "Water Tanker",
              description:
                "Reliable tanker services for large volume water delivery.",
              price: "$100",
            },
            {
              image: swimmingPoolWaterImage,
              title: "Swimming Pool Water",
              description: "Crystal clear water for your swimming pool needs.",
              price: "$150",
            },
            {
              image: constructionWaterImage,
              title: "Construction Water",
              description: "Quality water solutions for construction projects.",
              price: "$200",
            },
            {
              image: agriculturalWaterImage,
              title: "Agricultural Water",
              description: "Efficient water supply for agricultural purposes.",
              price: "$250",
            },
          ].map((service, index) => (
            <div
              key={index}
              className="max-w-sm w-full bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-60 object-cover"
              />
              <div className="p-6 flex flex-col items-center">
                <h3 className="text-2xl font-bold text-blue-700">
                  {service.title}
                </h3>
                <p className="mt-2 text-gray-600">{service.description}</p>
                <p className="mt-2 text-lg font-semibold text-gray-800">
                  {service.price}
                </p>
                <button
                  className="mt-4 px-6 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors duration-300"
                  onClick={() => navigate("/root/place-order")}
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-12 bg-gradient-to-r from-blue-50 to-white text-center"
      >
        <h2 className="mb-6 text-4xl font-semibold text-blue-700">
          Contact Us
        </h2>
        <p className="mb-8 text-lg text-gray-700">
          Reach out to us for more information or to place an order.
        </p>
        <form className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-left text-lg font-semibold text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded"
              id="name"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-left text-lg font-semibold text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded"
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-left text-lg font-semibold text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              className="w-full px-4 py-3 border border-gray-300 rounded"
              rows={5}
              placeholder="Enter your message"
            />
          </div>
          <button className="w-full py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-300">
            Submit
          </button>
        </form>
      </section>
    </div>
  );
};

export default HomePage;
