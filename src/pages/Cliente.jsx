import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue, push, remove } from "firebase/database";
import { database } from "../firebase.js";

export default function Cliente() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState(localStorage.getItem("clientPhone") || "");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // 🔹 Horários (10:00 até 20:00)
  const times = [];
  for (let h = 10; h <= 19; h++) {
    for (let m of [0, 45]) {
      times.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    }
  }
  times.push("20:00");

  const defaultServices = [
    { key: "corte_ter_qua", name: "Corte (terça a quinta)", price: 50 },
    { key: "corte_sex_sab", name: "Corte (sexta a sábado)", price: 60 },
    { key: "barba_tradicional", name: "Barba Tradicional", price: 35 },
    { key: "cabelo_barba", name: "Cabelo + Barba", price: 80 },
    { key: "platinado", name: "Platinado", price: 120 },
  ];

  const serviceOrder = [
    "corte_ter_qua",
    "corte_sex_sab",
    "barba_tradicional",
    "cabelo_barba",
    "platinado",
  ];

  // 🔹 Serviços
  useEffect(() => {
    const servicesRef = ref(database, "services");
    onValue(servicesRef, snapshot => {
      const data = snapshot.val();
      const orderedServices = data
        ? Object.entries(data)
            .sort((a, b) => serviceOrder.indexOf(a[0]) - serviceOrder.indexOf(b[0]))
            .map(([key, value]) => ({ key, ...value }))
        : defaultServices;
      setServices(orderedServices);
    });
  }, []);

  // 🔹 TODOS os agendamentos (controle global)
  useEffect(() => {
    const appointmentsRef = ref(database, "appointments");
    const unsubscribe = onValue(appointmentsRef, snapshot => {
      const data = snapshot.val();
      const all = data
        ? Object.entries(data).map(([key, value]) => ({ key, ...value }))
        : [];
      setAllAppointments(all);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Agendamentos do cliente
  useEffect(() => {
    if (!phone) return;

    const appointmentsRef = ref(database, "appointments");
    const unsubscribe = onValue(appointmentsRef, snapshot => {
      const data = snapshot.val();
      const filtered = data
        ? Object.entries(data)
            .map(([key, value]) => ({ key, ...value }))
            .filter(a => a.phone === phone)
        : [];
      setAppointments(filtered);
    });
    return () => unsubscribe();
  }, [phone]);

  // 🔹 Data e hora atual
  const now = new Date();
  const today = now.toLocaleDateString("sv-SE"); // yyyy-mm-dd
  const currentTime = now.toTimeString().slice(0, 5); // HH:mm

  const handleSubmit = () => {
    if (!name || !phone || !selectedService || !selectedDate || !selectedTime) {
      alert("❌ Preencha todos os campos!");
      return;
    }

    if (selectedDate < today) {
      alert("⛔ Não é possível agendar em datas passadas.");
      return;
    }

    if (selectedDate === today && selectedTime <= currentTime) {
      alert("⛔ Este horário já passou.");
      return;
    }

    localStorage.setItem("clientPhone", phone);

    const serviceObj = services.find(s => s.key === selectedService);
    const serviceName = serviceObj?.name || "";
    const servicePrice = serviceObj?.price || 0;

    const isOccupied = allAppointments.some(
      a =>
        a.date === selectedDate &&
        a.time === selectedTime &&
        a.status !== "cancelado"
    );

    if (isOccupied) {
      alert("⛔ Horário já está ocupado.");
      return;
    }

    push(ref(database, "appointments"), {
      name,
      phone,
      serviceKey: selectedService,
      serviceName,
      servicePrice,
      date: selectedDate,
      time: selectedTime,
      status: "agendado",
      createdAt: Date.now(),
    })
      .then(() => {
        alert("✅ Agendamento feito com sucesso!");
        setName("");
        setSelectedService("");
        setSelectedDate("");
        setSelectedTime("");
      })
      .catch(err => alert("❌ Erro ao agendar: " + err.message));
  };

  const handleCancel = key => {
    if (window.confirm("Deseja realmente cancelar este agendamento?")) {
      remove(ref(database, `appointments/${key}`));
    }
  };

  const handleChangePhone = () => {
    localStorage.removeItem("clientPhone");
    setPhone("");
    setAppointments([]);
  };

  return (
    <div style={styles.container}>
      <h1>Agendamento do Cliente</h1>

      <div style={styles.card}>
        <label>Nome:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} style={styles.input} />

        <label>Telefone:</label>
        <input
          type="text"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={styles.input}
          disabled={!!localStorage.getItem("clientPhone")}
        />
        {!!localStorage.getItem("clientPhone") && (
          <button onClick={handleChangePhone} style={{ marginTop: 6, padding: 6, fontSize: 14 }}>
            Trocar telefone
          </button>
        )}

        <label>Serviço:</label>
        <select value={selectedService} onChange={e => setSelectedService(e.target.value)} style={styles.input}>
          <option value="">Selecione o serviço</option>
          {services.map(s => (
            <option key={s.key} value={s.key}>
              {s.name} - R$ {s.price}
            </option>
          ))}
        </select>

        <label>Data:</label>
        <input
          type="date"
          value={selectedDate}
          min={today}
          onChange={e => setSelectedDate(e.target.value)}
          style={styles.input}
        />

        <label>Horário:</label>
        <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} style={styles.input}>
          <option value="">Selecione o horário</option>
          {times.map((t, i) => {
            const isPast =
              selectedDate === today && t <= currentTime;

            const isOccupied = allAppointments.some(
              a =>
                a.date === selectedDate &&
                a.time === t &&
                a.status !== "cancelado"
            );

            const disabled = isPast || isOccupied;

            return (
              <option key={i} value={t} disabled={disabled}>
                {t}
                {isPast ? " (Horário passado)" : ""}
                {isOccupied ? " (Ocupado)" : ""}
              </option>
            );
          })}
        </select>

        <button onClick={handleSubmit} style={styles.saveButton}>Agendar</button>
      </div>

      {appointments.length > 0 && (
        <>
          <h2>Seus Agendamentos</h2>
          <div style={styles.card}>
            {appointments.map(a => {
              const [year, month, day] = a.date.split("-");
              const formattedDate = `${day}-${month}-${year}`;
              return (
                <div key={a.key} style={styles.appointmentCard}>
                  <div style={styles.date}>{formattedDate}</div>
                  <div style={styles.time}>{a.time}</div>
                  <div style={styles.clientName}>{a.name}</div>
                  <div>{a.phone}</div>
                  <div>{a.serviceName} - R$ {Math.abs(a.servicePrice)}</div>
                  <button
                    onClick={() => handleCancel(a.key)}
                    style={{ ...styles.saveButton, backgroundColor: "red", marginTop: 6 }}
                  >
                    Cancelar
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      <button style={styles.backButton} onClick={() => navigate("/")}>Voltar</button>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#0a1a2a", color: "white", padding: 20, display: "flex", flexDirection: "column", alignItems: "center" },
  card: { backgroundColor: "white", color: "black", width: "90%", maxWidth: 400, padding: 20, borderRadius: 14, display: "flex", flexDirection: "column", gap: 12 },
  input: { padding: 8, borderRadius: 8, border: "1px solid gray", fontSize: 16, width: "100%" },
  saveButton: { marginTop: 10, padding: 8, backgroundColor: "#0a1a2a", color: "white", border: "none", borderRadius: 10, fontSize: 14, cursor: "pointer" },
  backButton: { marginTop: 20, padding: 10, backgroundColor: "white", color: "black", borderRadius: 10, border: "none", fontSize: 16, cursor: "pointer" },
  appointmentCard: { borderBottom: "1px solid gray", padding: 10, marginBottom: 10, display: "flex", flexDirection: "column" },
  date: { fontWeight: "bold", fontSize: 16, marginBottom: 2 },
  time: { marginBottom: 4 },
  clientName: { fontWeight: "bold", fontSize: 16 },
};

