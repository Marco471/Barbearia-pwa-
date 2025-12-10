// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import logo from "../assets/logo.jpg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#0a1a2a", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "20px", padding: "20px" }}>
      <img src={logo} alt="Barbearia Lucas Firmino" style={{ width: "140px", height: "140px", borderRadius: "50%", objectFit: "cover", border: "4px solid white" }} />

      <h1 style={{ color: "white", fontSize: "32px", textAlign: "center", marginTop: "10px" }}>Barbearia Lucas Firmino</h1>

      <a href="https://wa.me/5511941622764" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginTop: "10px" }}>
        <FaWhatsapp size={20} color="#25D366" />
        <span style={{ color: "#25D366", fontSize: "18px", fontWeight: "bold" }}>11 94162-2764</span>
      </a>

      <button style={{ width: "260px", padding: "14px", backgroundColor: "white", color: "black", border: "none", borderRadius: "12px", fontSize: "16px", cursor: "pointer", fontWeight: "bold" }} onClick={() => navigate("/cliente")}>Entrar como Cliente</button>

      <button style={{ width: "260px", padding: "14px", backgroundColor: "white", color: "black", border: "none", borderRadius: "12px", fontSize: "16px", cursor: "pointer", fontWeight: "bold" }} onClick={() => navigate("/barbeiro-login")}>Entrar como Barbeiro</button>
    </div>
  );
}


