// express is a class
const express = require("express");
// get an instance of express
const app = express();

const path = require("path");

const port = 3000;

// To use static files like img, css, and js files
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
