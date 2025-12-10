import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Cliente from "../pages/Cliente";
import BarbeiroLogin from "../pages/BarbeiroLogin";
import Barbeiro from "../pages/Barbeiro";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cliente" element={<Cliente />} />
        <Route path="/barbeiro-login" element={<BarbeiroLogin />} />
        <Route path="/barbeiro" element={<Barbeiro />} />
      </Routes>
    </BrowserRouter>
  );
}
