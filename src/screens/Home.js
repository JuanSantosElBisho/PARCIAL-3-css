import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import firebaseApp from '../firebase/credenciales';
import { getAuth, signOut } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function Home({ user }) {
  const [torneos, setTorneos] = useState([]);
  const [torneosRegistrados, setTorneosRegistrados] = useState([]);

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
        const usuarioDoc = await usuarioRef.get();
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

      // Actualizar el contador de participantes registrados en el torneo
      const torneoRef = doc(firestore, 'torneos', torneoId);
      await updateDoc(torneoRef, {
        participantesRegistrados: firebase.firestore.FieldValue.increment(1)
      });

      // Actualizar la lista de torneos registrados del usuario
      const usuarioRef = doc(firestore, 'usuarios', user.uid);
      await updateDoc(usuarioRef, {
        torneosRegistrados: arrayUnion(torneoId)
      });

      console.log(`Usuario ${user.uid} registrado en el torneo ${torneoId}`);
      // Mostrar una notificación de registro exitoso
      alert('¡Te has registrado en el torneo exitosamente!');
      // Actualizar la lista de torneos después del registro
      setTorneosRegistrados([...torneosRegistrados, torneoId]);
    } catch (error) {
      console.error('Error al registrar al usuario en el torneo:', error);
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => signOut(auth)}>Cerrar sesión</button>
      {user.rol === 'admin' ? <AdminView /> : <UserView torneos={torneos} torneosRegistrados={torneosRegistrados} onRegistroTorneo={handleRegistroTorneo} />}
    </div>
  );
}

export default Home;
