import { useEffect, useState } from "react";
import TarjetaContacto from "./TarjetaContacto";

function Directorio() {
  const [personas, setPersonas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/data/nosotros.json")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("No se pudo cargar el equipo");
        }

        return respuesta.json();
      })
      .then((data) => {
        setPersonas(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <p className="footer-state">Cargando equipo...</p>;
  }

  if (error) {
    return <p className="footer-state">{error}</p>;
  }

  return (
    <div className="team-grid">
      {personas.map((persona) => (
        <TarjetaContacto key={persona.id} persona={persona} />
      ))}
    </div>
  );
}

export default Directorio;