const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(colors.bgGreen.black('Database connection established'));
  } catch (err) {
    console.error(colors.bgRed.black('Database connection failed:', err));
    process.exit(1);
  }
};

module.exports = connectDB;