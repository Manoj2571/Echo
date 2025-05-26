require('dotenv').config()
const mongoose = require("mongoose");


// Access your MongoDB connection string from secrets
const mongoURI = process.env.MONGO_URI


const initializeDatabase = async () => {
    try {
        const connection = await mongoose.connect(mongoURI);
        if (connection) {
            console.log('Connected Successfully');
        }
    }

    catch (error) {
        console.log('Connection Failed', error)
    }
};

module.exports = { initializeDatabase };
