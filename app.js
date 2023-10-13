const express = require("express");
const morgan = require("morgan");
const path = require("path");
const index = require("./routes");
const errorHandler = require("errorhandler");
const cookieParser = require("cookie-parser");
const http2Express = require("http2-express-bridge");
require("./database");

const app = http2Express(express);
module.exports = app;

app.use(cookieParser());
require("./config/jwt.config");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(morgan("short"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(index);

if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    const code = err.code || 500;
    res.status(err.code || 500).json({
      code: code || 500,
      message: code === 500 ? null : err.message,
    });
  });
}
