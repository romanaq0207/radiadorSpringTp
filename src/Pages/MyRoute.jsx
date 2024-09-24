import React from "react";
import ejemplo from "./Images/ejemplo-map.jpg";
import Navbar from "../components/NavBar";
import "./MyRoute.css";

function MyRoute() {
  return (
    <div>
      <Navbar />
      <img id="img" src={ejemplo} />
    </div>
  );
}

export default MyRoute;
