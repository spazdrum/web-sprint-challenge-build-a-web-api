const express = require("express");
const project = require("./data/helpers/projectModel");

const router = express.Router();

router.get("/", (req, res) => {
  project
    .get()
    .then((project) => {
      res.status(200).json(project);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error retrieving projects" });
    });
});

router.get("/:id", validateId, (req, res) => {
  project
    .get(req.params.id)
    .then((project) => {
      res.status(200).json({ project });
    })
    .catch((err) => {
      res.status(404).json({ message: "Project ID not found" });
    });
});

router.post("/", validatePro, (req, res) => {
  project
    .insert(req.body)
    .then((project) => {
      res.status(201).json(project);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error adding new project" });
    });
});

router.delete("/:id", validateId, (req, res) => {
  project
    .remove(req.params.id)
    .then((project) => {
      res.status(200).json(project);
    })
    .catch((err) => {
      res /
        status(500).json({
          message: "Error removing project, please check the ID and try again",
        });
    });
});

router.put("/:id", validateId, (req, res) => {
  const id = req.params.id;
  const body = req.body;

  project
    .update(id, body)
    .then((updated) => {
      res.status(200).json(updated);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error updating project" });
    });
});

function validateId(req, res, next) {
  project.get(req.params.id).then((project) => {
    if (project) {
      req.project = project;
      next();
    } else {
      res.status(404).json({ message: "Invalid project ID." });
    }
  });
}

function validatePro(req, res, next) {
  const body = req.body;
  const name = req.body.name;
  const description = req.body.description;
  if (!body) {
    res.status(400).json({ message: "Missing project data" });
  } else if (!name || !description) {
    res.status(400).json({ message: "Missing required field" });
  } else {
    next();
  }
}

module.exports = router;
