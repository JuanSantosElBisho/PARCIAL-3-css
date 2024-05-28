import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc, arrayUnion, increment } from 'firebase/firestore';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import firebaseApp from '../firebase/credenciales';
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function Home({ user }) {
  const [torneos, setTorneos] = useState([]);
  const [torneosRegistrados, setTorneosRegistrados] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const torneosCollection = collection(firestore, 'torneos');
        const torneosSnapshot = await getDocs(torneosCollection);
        const torneosData = torneosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTorneos(torneosData);
      } catch (error) {
        console.error('Error al obtener los torneos:', error);
      }
    };

    fetchTorneos();
  }, []);

  useEffect(() => {
    const fetchTorneosRegistrados = async () => {
      try {
        const usuarioRef = doc(firestore, 'usuarios', user.uid);
        const usuarioDoc = await getDocs(usuarioRef);
        if (usuarioDoc.exists()) {
          const data = usuarioDoc.data();
          if (data && data.torneosRegistrados) {
            setTorneosRegistrados(data.torneosRegistrados);
          }
        }
      } catch (error) {
        console.error('Error al obtener los torneos registrados del usuario:', error);
      }
    };

    if (user) {
      fetchTorneosRegistrados();
    }
  }, [user]);

  const handleRegistroTorneo = async (torneoId) => {
    try {
      if (torneosRegistrados.includes(torneoId)) {
        alert('¡Ya estás registrado en este torneo!');
        return;
      }

      const torneoRef = doc(firestore, 'torneos', torneoId);
      await updateDoc(torneoRef, {
        participantesRegistrados: increment(1)
      });

      const usuarioRef = doc(firestore, 'usuarios', user.uid);
      await updateDoc(usuarioRef, {
        torneosRegistrados: arrayUnion(torneoId)
      });

      console.log(`Usuario ${user.uid} registrado en el torneo ${torneoId}`);
      alert('¡Te has registrado en el torneo exitosamente!');

      setTorneos((prevTorneos) => 
        prevTorneos.map((torneo) =>
          torneo.id === torneoId
            ? { ...torneo, participantesRegistrados: torneo.participantesRegistrados + 1 }
            : torneo
        )
      );

      setTorneosRegistrados((prevRegistrados) => [...prevRegistrados, torneoId]);
    } catch (error) {
      console.error('Error al registrar al usuario en el torneo:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='registrados'>
      <header>
        <button onClick={toggleSidebar}>Torneos Registrados</button>
      </header>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2>Torneos Registrados</h2>
      </div>
      {user.rol === 'admin' ? (
        <AdminView />
      ) : (
        <UserView
          torneosIniciales={torneos}
          torneosRegistrados={torneosRegistrados}
          onRegistroTorneo={handleRegistroTorneo}
        />
      )}
    </div>
  );
}

export default Home;
