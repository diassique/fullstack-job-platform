const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Database connection established');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
};

module.exports = connectDB;