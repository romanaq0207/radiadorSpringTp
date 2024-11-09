import React, { useState, useEffect } from "react";
import RutesCard from "./RoutesCard";
import "./RoutesVerify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { API_BASE_URL } from "../assets/config";
import Swal from "sweetalert2"; // Importa SweetAlert2

function RutesVerify() {
  const [allRutas, setAllRutas] = useState([]);
  const navigate = useNavigate();
  const [selectedEstado, setSelectedEstado] = useState();
  const [filteredRutas, setFilteredRutas] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [conductores, setConductores] = useState([]);
  const [selectedKilometro, setSelectedKilometro] = useState([]);
  const [selectedConductor, setSelectedConductor] = useState([]);

  const handleEstadoChange = (e) => {
    const estado = e.target.value;
    setSelectedEstado(estado);
    filterEstadoRutas(estado);
  };
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    filterByDate(date);
  };
  const handleConductoresChange = (e) => {
    const conductor = e.target.value;
    setSelectedConductor(conductor);
    filterByConductor(conductor);
  };
  const handleKilometroChange = (e) => {
    const kilometro = e.target.value;
    setSelectedKilometro(kilometro);
    filterByKilometro(kilometro);
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/ver-rutas`)
      .then((response) => {
        setAllRutas(response.data), setFilteredRutas(response.data);
      })
      .catch((error) => console.error("Error al obtener rutas:", error));
  }, []);

  //obtengo los conductores
  useEffect(() => {
    const fetchConductores = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/conductores`);
        const conductoresHabilitados = response.data.filter(
          (conductor) => conductor.habilitado
        );
        setConductores(conductoresHabilitados);
      } catch (error) {
        console.error("Error al obtener los conductores:", error);
      }
    };
    fetchConductores();
  }, []);

  const handleApprove = (idRuta) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres aprobar esta ruta?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, aprobar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${API_BASE_URL}/aprobar-ruta`, { id_ruta: idRuta })
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Ruta aprobada",
              text: "La ruta ha sido aprobada exitosamente.",
            });

            // Actualiza el estado local para reflejar el cambio
            setAllRutas((prevRutas) =>
              prevRutas.map((ruta) =>
                ruta.id_ruta === idRuta ? { ...ruta, estado: "aprobada" } : ruta
              )
            );
          })
          .catch((error) => {
            console.error("Error al aprobar ruta:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un problema al aprobar la ruta.",
            });
          });
      }
    });
  };

  const handleReject = (idRuta) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres rechazar esta ruta?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, rechazar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${API_BASE_URL}/rechazar-ruta`, { id_ruta: idRuta })
          .then(() => {
            Swal.fire({
              icon: "warning",
              title: "Ruta rechazada",
              text: "La ruta ha sido rechazada.",
            });

            // Actualiza el estado local para reflejar el cambio
            setAllRutas((prevRutas) =>
              prevRutas.map((ruta) =>
                ruta.id_ruta === idRuta
                  ? { ...ruta, estado: "rechazada" }
                  : ruta
              )
            );
          })
          .catch((error) => {
            console.error("Error al rechazar ruta:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un problema al rechazar la ruta.",
            });
          });
      }
    });
  };

  const filterEstadoRutas = (term) => {
    if (term === "") {
      setFilteredRutas(allRutas);
    } else {
      const filtered = allRutas.filter((rutas) => rutas.estado.includes(term));
      setFilteredRutas(filtered);
    }
  };
  const filterByDate = (date) => {
    if (date === "") {
      setFilteredRutas(allRutas);
    } else {
      const filtered = allRutas.filter((rutas) => {
        const rutasDate = new Date(rutas.fecha_creacion);
        const selected = new Date(date);
        return (
          rutasDate.getDate() - 1 === selected.getDate() &&
          rutasDate.getMonth() === selected.getMonth() &&
          rutasDate.getFullYear() === selected.getFullYear()
        );
      });
      setFilteredRutas(filtered);
    }
  };
  const filterByConductor = (conductor) => {
    if (conductor === "") {
      setFilteredRutas(allRutas);
    } else {
      const filter = allRutas.filter((rutas) =>
        rutas.conductor.includes(conductor)
      );
      setFilteredRutas(filter);
    }
  };
  const filterByKilometro = (kilometro) => {
    if (kilometro === "") {
      setFilteredRutas(allRutas);
    }
    if (kilometro === "descendente") {
      const sorted = [...allRutas].sort(
        (a, b) => b.distancia_total_km - a.distancia_total_km
      );
      setFilteredRutas(sorted);
    }
    if (kilometro === "ascendente") {
      const sorted = [...allRutas].sort(
        (a, b) => a.distancia_total_km - b.distancia_total_km
      );
      setFilteredRutas(sorted);
    }
  };

  return (
    <div className="routes-verify-container" id="routes-verify-container">
      <Navbar />
      <h2>RUTAS</h2>

      <div className="routes-verify-filters">
        {/*filtro por estado de ruta*/}
        <select
          className="route-verify-input"
          value={selectedEstado}
          onChange={handleEstadoChange}
        >
          <option value="">Estado de la ruta</option>
          <option value="pendiente">Pendiente</option>
          <option value="aprobada">Aprobada</option>
          <option value="rechazada">Rechazada</option>
          <option value="completa">Completada</option>
        </select>
        {/*filtro por conductor asignado*/}
        <select
          className="route-verify-input"
          onChange={handleConductoresChange}
          defaultValue={""}
        >
          <option value="" disabled>
            Selecciona un conductor
          </option>
          <option value="">Todos</option>
          {conductores.map((conductor) => (
            <option key={conductor.dni} value={conductor.dni}>
              {conductor.nombre} ({conductor.dni})
            </option>
          ))}
        </select>
        {/*filtro por kilometros asc. desc.*/}
        <select
          value={selectedKilometro}
          onChange={handleKilometroChange}
          className="route-verify-input"
        >
          <option value="">Filtrar por kilometro de forma:</option>
          <option value="descendente">Descendente</option>
          <option value="ascendente">Ascendente</option>
        </select>
        {/*filtro por fecha de creacion de ruta*/}
        <label className="route-verify-date_label">
          Filtrar por fecha:
        </label>{" "}
        <input
          type="date"
          id="filterDate"
          value={selectedDate}
          onChange={handleDateChange}
          className="route-verify-date"
        />
      </div>
      <div className="routes-card-list" id="routes-card-list">
        {filteredRutas.length > 0 ? (
          filteredRutas.map((ruta) => (
            <RutesCard
              key={ruta.id_ruta}
              ruta={ruta}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        ) : (
          <p>No se encontraron rutas.</p>
        )}
      </div>
    </div>
  );
}

export default RutesVerify;
