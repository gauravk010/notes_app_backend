const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const ConnectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECT);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = ConnectToDB;
