// Bring in the DB connection and the Trip schema
const Mongoose = require('./db');  // Import database connection
const Trip = require('./travlr');  // Import the Trip model/schema

// Read seed data from json file
var fs = require('fs');  // Import Node.js file system module
var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));  // Read and parse the JSON file

// Delete any existing records, then insert seed data
const seedDB = async () => {
    await Trip.deleteMany({});  // Remove all existing documents in the Trip collection
    await Trip.insertMany(trips);  // Insert new trip data from JSON file
};

// Close the MongoDB connection and exit
seedDB().then(async () => {
    await Mongoose.connection.close();  // Close database connection
    process.exit(0);  // Exit the script
});
