require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// CORS : autorise ton domaine Netlify

app.use(
  cors({
    origin: [
      "http://localhost:5500", // Pour tes tests locaux
      "http://localhost:3000", // (optionnel, si tu fais aussi du test direct)
      "https://alsquareexpertise.org", // Ton domaine Netlify/production
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error(err));

app.use("/realisations", require("./routes/realisations"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
