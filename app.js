const express = require("express");
const app = express();
const connectDB = require("./config/db");
const eventosRoutes = require("./routes/eventos");

app.use(express.json());

// Usar las rutas desclaradas previamente, ya sea de base de datos o los endpoints
app.use(eventosRoutes);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    }); //Si la base de datos esta ON realiza consulta, sino tira error
  })
  .catch((error) => {
    console.error("Error al iniciar la aplicación:", error);
  });