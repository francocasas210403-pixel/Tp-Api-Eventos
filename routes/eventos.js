const express = require("express");
const router = express.Router();
const ModelEvento = require("../models/eventoModel");

// Endpoint auxiliar: Crear un nuevo evento (necesario para cargar datos de prueba)
router.post("/eventos", async (req, res) => {
  try {
    const nuevoEvento = new ModelEvento(req.body); //crear turno
    await nuevoEvento.save();//Guardar el turno en la base de datos
    res.status(201).json({ mensaje: "Evento creado con éxito", evento: nuevoEvento });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear evento", error: error.message });
  }
});

//Registrar participante
router.post("/eventos/:id/registrar", async (req, res) => {
  try {
    const { id } = req.params; //obtiene el :id del evento desde la URL y se la guarda en una variable
    const { nombre, email } = req.body; //Obtiene los datos que pone el usuario

    const evento = await ModelEvento.findById(id); //Consulta a la db

    if (!evento) { // si en la consutano no ! envuentra el evento, tira este mensaje
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    if (evento.entradasDisponibles <= 0) {//Consulta las entradas, si no hay o es - o = a 0, no hay entradas
      return res.status(400).json({ mensaje: "No hay entradas disponibles para este evento" });
    }

    evento.participantes.push({ nombre, email }); // Si todo lo anterior no se cumple, guarda el usuario
    evento.entradasDisponibles -= 1; //al total de entradas le resta 1

    await evento.save(); //Modifica la db del evento con los datos del usuario y entradas disponibles

    res.status(200).json({ mensaje: "Participante registrado con éxito", evento });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
});

// 2. Obtener eventos con entradas disponibles
router.get("/eventos/disponibles", async (req, res) => {
  try {
    const eventos = await ModelEvento.find({ entradasDisponibles: { $gt: 0 } }); //consulta a la db, la variable entradas sea mayor a 0
    res.status(200).json(eventos); //Si cumple la condición trae los eventos con 1 o más entradas
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener eventos disponibles", error: error.message });
  }
});

//Obtener eventos por fecha (YYYY-MM-DD)
router.get("/eventos/fecha/:fecha", async (req, res) => {
  try {
    const { fecha } = req.params;
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fecha);
    fechaFin.setDate(fechaFin.getDate() + 1); //Estas lineas establecen que desde 00hs hasta las 23:59hs del mismo día, se traigan los eventos de esa fecha

    const eventos = await ModelEvento.find({
      fecha: { $gte: fechaInicio, $lt: fechaFin },
    });

    res.status(200).json(eventos);//Si hay, trae por fecha(dia)
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar eventos por fecha", error: error.message });
  }
});

module.exports = router;