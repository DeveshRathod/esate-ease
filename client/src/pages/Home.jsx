import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      style={{ height: "90vh" }}
      className="flex flex-col justify-center items-center bg-white"
    >
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl lg:text-6xl font-bold text-center">
          Welcome to <span>HomeHive</span>
        </h1>
        <p className="mt-4 text-center text-sm">
          Your ultimate destination for finding your dream home.
          <br />
          Explore our vast collection of properties and make your dream a
          reality.
        </p>
        <div className="mt-8 flex justify-center">
          <Link to={"/search"}>
            <button className="text-white bg-[#ac7e60] px-6 py-3 rounded-md">
              Find Your Dream Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
