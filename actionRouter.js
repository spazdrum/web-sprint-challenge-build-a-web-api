const express = require('express');
const action = require('./data/helpers/actionModel');

const router = express.Router();

router.get('/', (req, res) => {
    action.get()
        .then((action) => {
            res.status(200).json(action);
        })
        .catch((err) => {
            res.status(404).json({ message: 'Actions not found' });
        });
});

router.put('/:id', (req, res) => {})

router.delete('/:id', (req, res) => {})

module.exports = router;