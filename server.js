const express     = require("express");
const connectToDB = require("./config/database");
const cors        = require("cors");

const app  = express();
const PORT = process.env.PORT || 5000;

// Connect to database.
connectToDB();

// Initialize middleware for the body parser.
app.use(express.json({ extended: false }));
app.use(cors());

// Define routes.
app.get("/", (req, res) => {
  res.send("API running...");
});
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profiles", require("./routes/api/profiles"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
