const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt"); // à installer : npm install bcrypt

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("[AUTH] Tentative de connexion :", { email, password });
  try {
    const user = await User.findOne({ email });
    console.log("[AUTH] Utilisateur trouvé :", user);
    if (!user) {
      console.log("[AUTH] Utilisateur non trouvé");
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    // Si tu as hashé le mot de passe :
    // const valid = await bcrypt.compare(password, user.password);
    // if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });

    // Si mot de passe en clair (à sécuriser plus tard) :
    if (user.password !== password) {
      console.log("[AUTH] Mot de passe incorrect");
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }
    console.log("[AUTH] Connexion réussie pour :", user.email);
    // On ne renvoie pas le mot de passe !
    res.json({
      id: user._id,
      nom: user.nom,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("[AUTH] Erreur serveur :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /auth/change-password
router.post("/change-password", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  console.log("[AUTH] Demande de changement de mot de passe pour:", email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(
        "[AUTH] Utilisateur non trouvé pour changement de mot de passe"
      );
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }
    if (user.password !== oldPassword) {
      console.log("[AUTH] Ancien mot de passe incorrect");
      return res.status(401).json({ message: "Ancien mot de passe incorrect" });
    }
    user.password = newPassword;
    await user.save();
    console.log("[AUTH] Mot de passe mis à jour pour:", email);
    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    console.error("[AUTH] Erreur lors du changement de mot de passe:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
