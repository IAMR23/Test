'use client';

import React, { useEffect, useState } from 'react';
import { addDoc, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import QRCode from 'react-qr-code';

import { db } from '../../../firebase'; // Asegúrate de configurar Firebase

const CursoScreen = () => {
  const [nombre, setNombre] = useState('');
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cursos'), (snapshot) => {
      setCursos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const agregarCurso = async () => {
    if (!nombre) return;
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'cursos'), {
        nombre,
        descripcion: 'Sin descripción',
        fecha: new Date(),
      });
      setNombre('');
    } catch (error) {
      alert('Error al agregar curso: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarCurso = async (id, nuevoNombre, nuevaDescripcion) => {
    try {
      await updateDoc(doc(db, 'cursos', id), {
        nombre: nuevoNombre,
        descripcion: nuevaDescripcion,
      });
    } catch (error) {
      alert('Error al actualizar curso: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-green-700">Gestión de Cursos</h1>
      <div className="my-4">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del Curso"
          className="border p-2 w-full"
        />
        <button onClick={agregarCurso} className="bg-green-700 text-white p-2 mt-2 w-full" disabled={isLoading}>
          {isLoading ? 'Agregando...' : 'Agregar Curso'}
        </button>
      </div>
      <div>
        {cursos.length === 0 ? (
          <p>No hay cursos disponibles</p>
        ) : (
          cursos.map((curso) => (
            <div key={curso.id} className="border p-4 my-2">
              <input
                type="text"
                value={curso.nombre}
                onChange={(e) => actualizarCurso(curso.id, e.target.value, curso.descripcion)}
                className="border p-2 w-full font-bold text-green-700"
              />
              <input
                type="text"
                value={curso.descripcion}
                onChange={(e) => actualizarCurso(curso.id, curso.nombre, e.target.value)}
                className="border p-2 w-full text-gray-600 mt-2"
              />
              <p className="text-xs text-gray-500">ID: {curso.id}</p>
              <div className="flex justify-center mt-4">
                <QRCode value={curso.id} size={100} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default CursoScreen;
