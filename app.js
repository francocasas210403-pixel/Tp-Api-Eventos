const express = require("express");
const cors = require("cors"); // <--- Importar cors
const app = express();
const connectDB = require("./config/db");
const eventosRoutes = require("./routes/eventos");

app.use(cors()); // <--- Habilitar CORS para React
app.use(express.json());

app.use(eventosRoutes);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al iniciar la aplicación:", error);
  });