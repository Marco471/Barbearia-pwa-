// src/pages/Barbeiro.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue, set, remove } from "firebase/database";
import { database } from "../firebase.js";

export default function Barbeiro() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filterToday, setFilterToday] = useState(true); // filtro para hoje ou todos

  const defaultServices = [
    { key: "corte_ter_qua", name: "Corte (terça a quinta)", price: 50 },
    { key: "corte_sex_sab", name: "Corte (sexta a sábado)", price: 60 },
    { key: "barba_tradicional", name: "Barba Tradicional", price: 35 },
    { key: "cabelo_barba", name: "Cabelo + Barba", price: 80 },
    { key: "platinado", name: "Platinado", price: 120 },
  ];

  const serviceOrder = ["corte_ter_qua", "corte_sex_sab", "barba_tradicional", "cabelo_barba", "platinado"];

  useEffect(() => {
    const servicesRef = ref(database, "services");
    onValue(servicesRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const orderedServices = Object.entries(data)
          .sort((a, b) => serviceOrder.indexOf(a[0]) - serviceOrder.indexOf(b[0]))
          .map(([key, value]) => ({
            key,
            name: value.name || defaultServices.find(s => s.key === key)?.name,
            price: value.price || defaultServices.find(s => s.key === key)?.price
          }));
        setServices(orderedServices);
      } else {
        setServices(defaultServices);
        const updates = {};
        defaultServices.forEach(s => updates[s.key] = { name: s.name, price: s.price });
        set(servicesRef, updates);
      }
    });

    const appointmentsRef = ref(database, "appointments");
    onValue(appointmentsRef, snapshot => {
      const data = snapshot.val();
      setAppointments(data ? Object.entries(data).map(([key, value]) => ({
        key,
        name: value.name || "",
        phone: value.phone || "",
        serviceName: value.serviceName || value.service || "",
        servicePrice: value.servicePrice || value.price || 0,
        date: value.date,
        time: value.time
      })) : []);
    });
  }, []);

  const salvarPrecos = () => {
    const updates = {};
    services.forEach(s => updates[s.key] = { name: s.name, price: s.price });
    set(ref(database, "services"), updates)
      .then(() => alert("✅ Preços salvos com sucesso!"))
      .catch(err => alert("❌ Erro ao salvar preços: " + err.message));
  };

  const apagarAgendamento = key => {
    if (!key) return alert("Chave do agendamento não encontrada!");
    if (window.confirm("Deseja realmente apagar este agendamento?")) {
      remove(ref(database, `appointments/${key}`))
        .then(() => alert("🗑️ Agendamento apagado com sucesso!"))
        .catch(err => alert("❌ Erro ao apagar agendamento: " + err.message));
    }
  };

  // Obtém a data local em formato yyyy-mm-dd
  const today = new Date();
  const localToday = today.toLocaleDateString('sv-SE'); // yyyy-mm-dd

  // Filtra os agendamentos para hoje ou todos
  const displayedAppointments = filterToday
    ? appointments.filter(a => a.date === localToday)
    : [...appointments].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  return (
    <div style={styles.container}>
      <h1>Painel do Barbeiro</h1>

      <div style={styles.card}>
        <h2>Atualizar Preços</h2>
        {services.map(s => (
          <div key={s.key} style={styles.serviceRow}>
            <span>{s.name}</span>
            <input
              type="number"
              value={s.price}
              onChange={e =>
                setServices(prev => prev.map(serv => serv.key === s.key ? { ...serv, price: Number(e.target.value) || 0 } : serv))
              }
              style={styles.input}
            />
          </div>
        ))}
        <button onClick={salvarPrecos} style={styles.saveButton}>Salvar Preços</button>
      </div>

      <div style={{ ...styles.card, marginTop: 20 }}>
        <h2>Agendamentos</h2>
        <button
          onClick={() => setFilterToday(!filterToday)}
          style={{ ...styles.saveButton, backgroundColor: "#555", marginBottom: 10 }}
        >
          {filterToday ? "Ver Todos" : "Ver Hoje"}
        </button>
        {displayedAppointments.length === 0 && <p>Nenhum agendamento</p>}
        {displayedAppointments.map(a => {
          const [year, month, day] = a.date.split("-");
          const formattedDate = `${day}-${month}-${year}`;
          return (
            <div key={a.key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span>
                {formattedDate} {a.time} - {a.serviceName} | {a.name} | {a.phone} | R$ {a.servicePrice}
              </span>
              <button onClick={() => apagarAgendamento(a.key)} style={{ ...styles.saveButton, backgroundColor: "red" }}>Apagar</button>
            </div>
          );
        })}
      </div>

      <button style={styles.backButton} onClick={() => navigate("/")}>Voltar</button>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#0a1a2a", color: "white", padding: 20, display: "flex", flexDirection: "column", alignItems: "center" },
  card: { backgroundColor: "white", color: "black", width: "90%", maxWidth: 500, padding: 20, borderRadius: 14, display: "flex", flexDirection: "column", gap: 12 },
  serviceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  input: { padding: 8, borderRadius: 8, border: "1px solid gray", fontSize: 16, width: 100 },
  saveButton: { marginTop: 10, padding: 12, backgroundColor: "#0a1a2a", color: "white", border: "none", borderRadius: 10, fontSize: 16, cursor: "pointer" },
  backButton: { marginTop: 20, padding: 10, backgroundColor: "white", color: "black", borderRadius: 10, border: "none", fontSize: 16, cursor: "pointer" },
};





