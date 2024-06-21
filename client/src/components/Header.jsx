import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className=" bg-[#ac7e60] shadow-md p-4">
      <div className=" flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className=" font-bold text-sm sm:text-xl flex flex-wrap">
            <span className=" text-white">HomeHive</span>
          </h1>
        </Link>

        <ul className=" flex gap-4">
          <Link to="/">
            <li className="hidden  sm:inline text-white">Home</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                className=" rounded-full h-7 w-7 object-cover"
                alt="profile"
              />
            ) : (
              <li className="sm:inline text-white">Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
