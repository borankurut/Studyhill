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


app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/about.html"));
});


app.get("/go-room", (req, res) => {
  res.sendFile(path.join(__dirname, "/go-room.html"));
});


app.get("/create-room", (req, res) => {
  res.sendFile(path.join(__dirname, "/create-room.html"));
});

app.get("/room", (req, res) => {
  res.sendFile(path.join(__dirname, "/room.html"));
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
