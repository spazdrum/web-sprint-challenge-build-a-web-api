const express = require("express");
const action = require("./data/helpers/actionModel");

const router = express.Router();

router.get("/", validateId, (req, res) => {
  action
    .get()
    .then((action) => {
      res.status(200).json(action);
    })
    .catch((err) => {
      res.status(404).json({ message: "Actions not found" });
    });
});

router.get("/:id", validateId, (req, res) => {
  action
    .get(req.params.id)
    .then((action) => {
      res.status(200).json({ action });
    })
    .catch((err) => {
      res.status(404).json({ message: "Actions not found" });
    });
});

router.post("/", validateAct, (req, res) => {
  action
    .insert(req.body)
    .then((action) => {
      res.status(201).json(action);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error adding action!" });
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  action
    .update(id, changes)
    .then((updated) => {
      res.status(201).json({ message: "Action successfully updated!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error updating action!" });
    });
});

router.delete("/:id", (req, res) => {
  action
    .remove(req.params.id)
    .then((action) => {
      if (action > 0) {
        res.status(200).json({ message: "Action successfully deleted!" });
      } else {
        res.status(404).json({ message: "Action not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Error updating action" });
    });
});

function validateAct(req, res, next) {
  const body = req.body;
  const proId = req.body.project_id;
  const desc = req.body.description;
  const note = req.body.notes;
  if (!body) {
    res.status(400).json({ message: "Missing action data" });
  } else if (!proId || !note || !desc) {
    res.status(400).json({ message: "Missing required field" });
  } else if (desc.length >= 128) {
    res
      .status(403)
      .json({ message: "Please keep description below 128 characters" });
  } else {
    next();
  }
}

function validateId(req, res, next) {
  action.get(req.params.id).then((action) => {
    if (action) {
      req.action = action;
      next();
    } else {
      res.status(404).json({ message: "Invalid action ID" });
    }
  });
}

module.exports = router;
