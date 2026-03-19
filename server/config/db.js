const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

const connectDb = async () => {
  try {
    // Use in-memory MongoDB so no Atlas/local install needed
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('MongoDB in-memory connected at:', uri);
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDb;
