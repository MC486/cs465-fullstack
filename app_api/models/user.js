const mongoose = require('mongoose');
const crypto = require('crypto'); // Adding the crypto module for hashing
const jwt = require('jsonwebtoken'); // Adding the jsonwebtoken module

// Defining the schema for the user model
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hash: String,  // Hashed password field
    salt: String   // Salt for the hashed password
});

// Method to set the password on this record
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex'); // Generate a 16-byte salt
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex'); 
    // Hash the password with salt, 1000 iterations, and sha512 hash algorithm
};

// Method to compare entered password against stored hash
userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex'); 
    return this.hash === hash; // Return true if the entered password's hash matches the stored hash
};

// Method to generate a JSON Web Token for the current record
userSchema.methods.generateJWT = function() {
    return jwt.sign(
        { 
            _id: this._id, 
            email: this.email, 
            name: this.name 
        },
        process.env.JWT_SECRET, // Secret stored in .env file
        { expiresIn: '1h' } // Token expires in 1 hour
    );
};

// Define and export the User model
const User = mongoose.model('users', userSchema);
module.exports = User;
