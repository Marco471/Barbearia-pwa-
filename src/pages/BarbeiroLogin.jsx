import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BarbeiroLogin() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState("");

  const senhaCorreta = "121314";

  function handleLogin() {
    if (senha === senhaCorreta) {
      navigate("/barbeiro");
    } else {
      alert("Senha incorreta!");
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#0a1a2a",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        color: "white",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          backgroundColor: "#11263b",
          padding: 20,
          borderRadius: 12,
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: 15, fontSize: 22 }}>
          Acesso do Barbeiro
        </h1>

        <input
          type="password"
          placeholder="Digite a senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{
            width: "100%",      // mesma largura que o botão
            boxSizing: "border-box",
            padding: 6,         // ajuste uniforme
            borderRadius: 6,
            border: "none",
            marginBottom: 12,
            fontSize: 14,
            height: 36,
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",      // mesma largura que o input
            padding: 6,
            backgroundColor: "white",
            color: "black",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            height: 36,         // mesma altura do input
          }}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}


