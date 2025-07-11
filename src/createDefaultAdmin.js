require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

const MONGODB_URI = process.env.MONGODB_URI;

async function createAdmin() {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const adminExists = await User.findOne({
    email: "contact@alsquareexpertise.org",
  });
  if (adminExists) {
    console.log("Admin déjà existant.");
    process.exit();
  }

  const admin = new User({
    nom: "Alain Andele",
    email: "contact@alsquareexpertise.org",
    password: "1234", // à changer et à hasher plus tard !
    role: "admin",
  });

  await admin.save();
  console.log("Admin créé !");
  process.exit();
}

createAdmin();
