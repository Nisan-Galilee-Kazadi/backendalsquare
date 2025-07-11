const express = require("express");
const router = express.Router();
const Realisation = require("../models/realisations");

// GET /realisations
router.get("/", async (req, res) => {
  try {
    const realisations = await Realisation.find().sort({ date: -1 });
    res.json(realisations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /realisations
router.post("/", async (req, res) => {
  const { titre, description, imageUrls } = req.body;
  const realisation = new Realisation({ titre, description, imageUrls });
  try {
    const newRealisation = await realisation.save();
    res.status(201).json(newRealisation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /realisations/:id
router.put("/:id", async (req, res) => {
  try {
    const { titre, description, imageUrls } = req.body;
    const updated = await Realisation.findByIdAndUpdate(
      req.params.id,
      { titre, description, imageUrls },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /realisations/:id/like
router.post("/:id/like", async (req, res) => {
  const { visitorId } = req.body;
  try {
    const real = await Realisation.findById(req.params.id);
    if (!real) return res.status(404).json({ message: "Not found" });
    const alreadyLiked = real.likes.find(
      (like) => like.visitorId === visitorId
    );
    if (alreadyLiked) {
      // Unlike
      real.likes = real.likes.filter((like) => like.visitorId !== visitorId);
    } else {
      // Like
      real.likes.push({ visitorId, date: new Date() });
    }
    await real.save();
    res.json({ likes: real.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /realisations/:id/comment
router.post("/:id/comment", async (req, res) => {
  const { author, text } = req.body;
  try {
    const real = await Realisation.findById(req.params.id);
    if (!real) return res.status(404).json({ message: "Not found" });
    real.comments.push({ author, text, date: new Date() });
    await real.save();
    res.json(real.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /visitors (admin)
router.get("/visitors", async (req, res) => {
  try {
    const reals = await Realisation.find();
    const visitors = [];
    reals.forEach((real) => {
      real.likes.forEach((like) => {
        visitors.push({
          type: "like",
          visitorId: like.visitorId,
          date: like.date,
          realisationId: real._id,
        });
      });
      real.comments.forEach((comment) => {
        visitors.push({
          type: "comment",
          visitorId: comment.author,
          date: comment.date,
          realisationId: real._id,
          text: comment.text,
        });
      });
    });
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /realisations/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Realisation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Réalisation supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /realisations/:id/comment
router.delete("/:id/comment", async (req, res) => {
  const { author, date, text } = req.body;
  try {
    const real = await Realisation.findById(req.params.id);
    if (!real) return res.status(404).json({ message: "Not found" });
    // On supprime le commentaire qui correspond exactement à l'auteur, la date et le texte
    real.comments = real.comments.filter(
      (c) =>
        !(
          c.author === author &&
          c.text === text &&
          new Date(c.date).getTime() === new Date(date).getTime()
        )
    );
    await real.save();
    res.json({ message: "Commentaire supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
