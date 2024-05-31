const express = require("express");
const Notes = require("../models/notes");
const router = express.Router();

// ROUTE 1: Get notes as per user using: GET "/get-notes". Login required
router.get("/get-notes", async (req, res) => {
  try {
    const data = await Notes.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    if (data.length > 0) {
      res.status(200).json({ result: data, length: data.length });
    } else {
      res.status(200).json({ message: "Add your first note" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// ROUTE 2: Add note  using: POST "/add-note". Login required
router.post("/add-note", async (req, res) => {
  try {
    let note = new Notes({
      title: req.body.title,
      description: req.body.description,
      user: req.user.id,
    });
    const response = await note.save();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//  ROUTE 3: Delete an existing Note using: DELETE "/delete". Login required
router.delete("/delete-note/:id", async (req, res) => {
  try {
    const response = await Notes.findByIdAndDelete(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// ROUTE 4: Get Note by ID using: GET "/get-note/:id". Login required
router.get("/get-note/:id", async (req, res) => {
  try {
    const response = await Notes.findById(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// ROUTE 5: Update note by ID using: GET "/edit-note/:id". Login required
router.put("/edit-note/:id", async (req, res) => {
  try {
    const UpdatedNote = {};
    if (req.body.title) {
      UpdatedNote.title = req.body.title;
    }
    if (req.body.description) {
      UpdatedNote.description = req.body.description;
    }

    const response = await Notes.findByIdAndUpdate(req.params.id, UpdatedNote);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
