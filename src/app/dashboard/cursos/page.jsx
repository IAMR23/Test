'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, CircularProgress, Container, Grid, TextField, Typography } from '@mui/material';
import { addDoc, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import QRCode from 'react-qr-code';

import { db } from '../../../firebase'; // Asegúrate de configurar Firebase

const CursoScreen = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cursos'), (snapshot) => {
      setCursos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const agregarCurso = async () => {
    if (!nombre || !descripcion || !fechaInicio || !fechaFin) {
      alert('Todos los campos son obligatorios');
      return;
    }
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'cursos'), {
        nombre,
        descripcion,
        fechaInicio,
        fechaFin,
      });
      setNombre('');
      setDescripcion('');
      setFechaInicio('');
      setFechaFin('');
    } catch (error) {
      alert('Error al agregar curso: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarCurso = async (id, nuevoNombre, nuevaDescripcion, nuevaFechaInicio, nuevaFechaFin) => {
    try {
      await updateDoc(doc(db, 'cursos', id), {
        nombre: nuevoNombre,
        descripcion: nuevaDescripcion,
        fechaInicio: nuevaFechaInicio,
        fechaFin: nuevaFechaFin,
      });
    } catch (error) {
      alert('Error al actualizar curso: ' + error.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Gestión de Cursos
      </Typography>

      {/* Formulario para agregar curso */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del Curso"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Inicio"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Fin"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={agregarCurso}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? 'Agregando...' : 'Agregar Curso'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Lista de cursos */}
      {cursos.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ color: 'text.secondary' }}>
          No hay cursos disponibles
        </Typography>
      ) : (
        cursos.map((curso) => (
          <Card key={curso.id} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                {/* Nombre del Curso */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Nombre del Curso
                  </Typography>
                  <Typography variant="body1">{curso.nombre}</Typography>
                </Grid>

                {/* Descripción */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Descripción
                  </Typography>
                  <Typography variant="body1">{curso.descripcion}</Typography>
                </Grid>

                {/* Fecha de Inicio */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Fecha de Inicio
                  </Typography>
                  <Typography variant="body1">{curso.fechaInicio}</Typography>
                </Grid>

                {/* Fecha de Fin */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Fecha de Fin
                  </Typography>
                  <Typography variant="body1">{curso.fechaFin}</Typography>
                </Grid>

                {/* QR Code */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <QRCode value={`/inscripcion/${curso.id}`} size={100} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default CursoScreen;
