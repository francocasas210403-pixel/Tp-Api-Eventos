const express = require("express");
const router = express.Router();
const ModelEvento = require("../models/eventoModels");

// Endpoint auxiliar: Crear un nuevo evento (necesario para cargar datos de prueba)
router.post("/eventos", async (req, res) => {
  try {
    const nuevoEvento = new ModelEvento(req.body); // crear evento
    await nuevoEvento.save(); // Guardar el evento en la base de datos
    res.status(201).json({ mensaje: "Evento creado con éxito", evento: nuevoEvento });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear evento", error: error.message });
  }
});

// Registrar participante
router.post("/eventos/:id/registrar", async (req, res) => {
  try {
    const { id } = req.params; // obtiene el :id del evento desde la URL
    const { nombre, email } = req.body; // Obtiene los datos que pone el usuario

    const evento = await ModelEvento.findById(id); // Consulta a la db

    if (!evento) { // si no encuentra el evento, tira este mensaje
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    if (evento.entradasDisponibles <= 0) { // Consulta las entradas, si no hay o es menor/igual a 0
      return res.status(400).json({ mensaje: "No hay entradas disponibles para este evento" });
    }

    evento.participantes.push({ nombre, email }); // Guarda el usuario
    evento.entradasDisponibles -= 1; // al total de entradas le resta 1

    await evento.save(); // Modifica la db del evento

    res.status(200).json({ mensaje: "Participante registrado con éxito", evento });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
});

// Obtener eventos con entradas disponibles
router.get("/eventos/disponibles", async (req, res) => {
  try {
    const eventos = await ModelEvento.find({ entradasDisponibles: { $gt: 0 } }); // consulta a la db, entradas mayores a 0
    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener eventos disponibles", error: error.message });
  }
});

// Obtener eventos por fecha (YYYY-MM-DD)
router.get("/eventos/fecha/:fecha", async (req, res) => {
  try {
    const { fecha } = req.params;
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fecha);
    fechaFin.setDate(fechaFin.getDate() + 1); // Desde 00hs hasta las 23:59hs del mismo día

    const eventos = await ModelEvento.find({
      fecha: { $gte: fechaInicio, $lt: fechaFin },
    });

    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar eventos por fecha", error: error.message });
  }
});

// Actualizar un evento existente (PUT)
router.put("/eventos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const eventoActualizado = await ModelEvento.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!eventoActualizado) {
      return res.status(404).json({ mensaje: "Evento no encontrado para actualizar" });
    }

    res.status(200).json({ mensaje: "Evento actualizado con éxito", evento: eventoActualizado });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar el evento", error: error.message });
  }
});

// Eliminar un evento (DELETE)
router.delete("/eventos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const eventoEliminado = await ModelEvento.findByIdAndDelete(id);

    if (!eventoEliminado) {
      return res.status(404).json({ mensaje: "Evento no encontrado para eliminar" });
    }

    res.status(200).json({ mensaje: "Evento eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el evento", error: error.message });
  }
});

module.exports = router;