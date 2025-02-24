﻿const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens
const express = require('express');
const router = express.Router();

const tripsController = require("../controllers/trips");
const authController = require("../controllers/authentication");

// ✅ Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader == null) {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.sendStatus(401);
    }

    const headers = authHeader.split(' ');
    if (headers.length < 2) {
        console.log('Not enough tokens in Auth Header: ' + headers.length);
        return res.sendStatus(501);
    }

    const token = headers[1];
    if (token == null) {
        console.log('Null Bearer Token');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) {
            console.log('Token Validation Error!');
            return res.status(401).json('Token Validation Error!');
        }
        req.auth = verified; // Attach decoded token to request object
        next(); // Proceed to the next middleware/controller
    });
}

// ✅ User Registration and Login Endpoints
router
    .route("/register")
    .post(authController.register);

router
    .route("/login")
    .post(authController.login);

// ✅ Trip Endpoints (with authentication for protected routes)
router
    .route("/trips")
    .get(tripsController.tripsList)
    .post(authenticateJWT, tripsController.tripsAddTrip); // Protected POST

router
    .route("/trips/:tripCode")
    .get(tripsController.tripsFindByCode)
    .put(authenticateJWT, tripsController.tripsUpdateTrip); // Protected PUT

module.exports = router;
