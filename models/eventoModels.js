const mongoose = require("mongoose");

const eventoSchema = new mongoose.Schema({ //Esquema o estructura de los datos, el tipo y su prioridad o no
    nombre: { type: String, required: true },
    descripcion: { type: String },
    fecha: { type: Date, required: true },
    lugar: { type: String },
    participantes: [{ nombre: String, email: String }],
    capacidadMaxima: { type: Number },
    entradasDisponibles: { type: Number },
  },
  { 
    timestamps: true //Alamacena la fecha de creación 
  }
);

const ModelEvento = mongoose.model("eventos", eventoSchema); //Se crea el nombre de la colección o "Tabla" en la db, y el esquema que va a tener
module.exports = ModelEvento; 