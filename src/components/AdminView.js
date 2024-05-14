import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import AdminPanel from '../screens/AdminPanel';
import firebaseApp from '../firebase/credenciales';

const firestore = getFirestore(firebaseApp);

function AdminView() {
  const [mostrarFormularioCrear, setMostrarFormularioCrear] = useState(false);
  const [editarTorneoId, setEditarTorneoId] = useState(null);
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formularioEdicion, setFormularioEdicion] = useState({
    nombre: '',
    fechaLimite: '',
    imagenURL: '',
    maxParticipantes: 0,
    participantesRegistrados: 0
  });

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const torneosCollection = collection(firestore, 'torneos');
        const torneosSnapshot = await getDocs(torneosCollection);
        const torneosData = torneosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTorneos(torneosData);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los torneos:', error);
      }
    };

    fetchTorneos();
  }, []);

  const handleEditarTorneo = (id, torneo) => {
    setEditarTorneoId(id);
    setFormularioEdicion(torneo);
  };

  const handleGuardarEdicion = async () => {
    try {
      const torneoDoc = doc(firestore, 'torneos', editarTorneoId);
      await updateDoc(torneoDoc, formularioEdicion);
      const torneosActualizados = torneos.map(torneo => {
        if (torneo.id === editarTorneoId) {
          return { ...torneo, ...formularioEdicion };
        }
        return torneo;
      });
      setTorneos(torneosActualizados);
      setEditarTorneoId(null);
    } catch (error) {
      console.error('Error al editar el torneo:', error);
    }
  };

  const handleEliminarTorneo = async (id) => {
    try {
      const torneoDoc = doc(firestore, 'torneos', id);
      await deleteDoc(torneoDoc);
      const torneosFiltrados = torneos.filter(torneo => torneo.id !== id);
      setTorneos(torneosFiltrados);
    } catch (error) {
      console.error('Error al eliminar el torneo:', error);
    }
  };

  const handleFormularioEdicionChange = (e) => {
    const { name, value } = e.target;
    setFormularioEdicion(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div>
      {mostrarFormularioCrear ? (
        <AdminPanel onVolver={() => setMostrarFormularioCrear(false)} />
      ) : (
        <div>
          <h2>Panel de Administración</h2>
          <button onClick={() => setMostrarFormularioCrear(true)}>Crear Torneo</button>
          <h3>Torneos existentes:</h3>
          <ul>
            {loading ? (
              <div>Cargando...</div>
            ) : (
              torneos.map(torneo => (
                <li key={torneo.id}>
                  {editarTorneoId === torneo.id ? (
                    <div>
                      <input type="text" name="nombre" value={formularioEdicion.nombre} onChange={handleFormularioEdicionChange} />
                      <input type="text" name="fechaLimite" value={formularioEdicion.fechaLimite} onChange={handleFormularioEdicionChange} />
                      <input type="text" name="imagenURL" value={formularioEdicion.imagenURL} onChange={handleFormularioEdicionChange} />
                      <input type="number" name="maxParticipantes" value={formularioEdicion.maxParticipantes} onChange={handleFormularioEdicionChange} />
                      <input type="number" name="participantesRegistrados" value={formularioEdicion.participantesRegistrados} onChange={handleFormularioEdicionChange} />
                      <button onClick={handleGuardarEdicion}>Guardar</button>
                    </div>
                  ) : (
                    <div>
                      <div>Nombre: {torneo.nombre}</div>
                      <div>Fecha límite de inscripción: {torneo.fechaLimite}</div>
                      <img src={torneo.imagenURL} alt="Imagen del torneo" />
                      <div>Cantidad máxima de participantes: {torneo.maxParticipantes}</div>
                      <div>Participantes registrados: {torneo.participantesRegistrados}</div>
                      <button onClick={() => handleEditarTorneo(torneo.id, torneo)}>Editar</button>
                      <button onClick={() => handleEliminarTorneo(torneo.id)}>Eliminar</button>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminView;
