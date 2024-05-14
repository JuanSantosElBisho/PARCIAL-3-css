import React from "react";

function UserView({ torneos, torneosRegistrados, onRegistroTorneo }) {
  return (
    <div>
      <h2>Interfaz de Usuario</h2>
      <h3>Lista de Torneos Disponibles:</h3>
      <ul>
        {torneos.map(torneo => (
          <li key={torneo.id}>
            <div>Nombre: {torneo.nombre}</div>
            <div>Fecha límite de inscripción: {torneo.fechaLimite}</div>
            <div>Imagen: <img src={torneo.imagenURL} alt="Imagen del torneo" /></div>
            <div>Cantidad máxima de participantes: {torneo.maxParticipantes}</div>
            <div>Participantes registrados: {torneo.participantesRegistrados}</div>
            {torneosRegistrados.includes(torneo.id) ? (
              <div>¡Ya estás registrado en este torneo!</div>
            ) : (
              <button onClick={() => onRegistroTorneo(torneo.id)}>Registrarse</button>
            )}
          </li>
        ))}
      </ul>
      <h3>Torneos Registrados:</h3>
      <ul>
        {torneosRegistrados.map(torneoId => (
          <li key={torneoId}>
            <div>Nombre: {torneos.find(torneo => torneo.id === torneoId)?.nombre}</div>
            <div>Fecha límite de inscripción: {torneos.find(torneo => torneo.id === torneoId)?.fechaLimite}</div>
            <div>Imagen: <img src={torneos.find(torneo => torneo.id === torneoId)?.imagenURL} alt="Imagen del torneo" /></div>
            <div>Cantidad máxima de participantes: {torneos.find(torneo => torneo.id === torneoId)?.maxParticipantes}</div>
            <div>Participantes registrados: {torneos.find(torneo => torneo.id === torneoId)?.participantesRegistrados}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserView;
