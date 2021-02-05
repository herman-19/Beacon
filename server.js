const express     = require("express");
const connectToDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database.
connectToDB();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
