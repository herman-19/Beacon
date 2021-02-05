const mongoose = require("mongoose");
const conf     = require("config");
const db       = conf.get("mongoURI");

const connectToDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Connection to mongo database established...");
  } catch (error) {
    // Kill process, exit with failure.
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectToDB;
