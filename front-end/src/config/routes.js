import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Messenger from "../pages/messenger/Messenger";
import Profile from "../pages/profile/Profile";
import Register from "../pages/register/Register";
import Protected from "../components/Protected/Protected";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/profile/:username",
    component: Profile,
  },
  {
    path: "/messenger",
    component: Messenger,
  },
];

const RoutesApp = ({ currentUser }) => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {routes.map((route, index) => {
          const Page = route.component;

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Protected currentUser={currentUser}>
                  <Page />
                </Protected>
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
};

export default RoutesApp;
