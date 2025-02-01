const express = require("express");
const router = express.Router();

// This is where we import the controllers we will route
const tripsController = require("../controllers/trips");

//define route for our trips endpoint
router
    .route("/trips")
    .get(tripsController.tripsList);

// GET Method routes tripFindByCode - requires parameter
router
    .route("/trips/:tripCode")
    .get(tripsController.tripsFindByCode);

module.exports = router;