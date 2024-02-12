import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import { useSelector } from "react-redux";

const App = () => {
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const checkCurrentUserAndFetchUserData = async () => {
      if (currentUser) {
        try {
          const res = await fetch(`/api/auth/me/${currentUser._id}`, {
            method: "GET",
          });

          const data = await res.json();
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    checkCurrentUserAndFetchUserData();
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
