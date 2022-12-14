const path = require("path");
const express = require("express");
const hbs = require("hbs");
const utils = require("./utils.js");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
// app.com

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "My Title",
    name: "Aziz Murat Coktu",
  });
});

// app.com/help
// app.use("/help", express.static(publicDirectoryPath + "/help.html"));
app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help Page",
    name: "Aziz Murat Coktu",
    message: "This page is for helping your experience",
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "Help Page",
    name: "Aziz Murat Coktu",
    errorMessage: "Help article not found",
  });
});

app.get("/product", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

// app.com/about
// app.use("/about", express.static(publicDirectoryPath + "/about.html"));
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Aziz Murat Coktu",
  });
});

// app.com/weather
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!",
    });
  }
  utils
    .geocode(req.query.address)
    .then((coordinates) => utils.forecast(coordinates))
    .then((fcast) =>
      res.send({
        forecast: utils.forecastToString(fcast),
        location: `${fcast.accurateLocation}, ${fcast.city}/${fcast.country}`,
        givenAddress: req.query.address,
      })
    )
    .catch((err) =>
      res.send({
        error: err.message,
      })
    );
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Aziz Murat Coktu",
    errorMessage: "Page not found",
  });
});
// starts the app.
app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
