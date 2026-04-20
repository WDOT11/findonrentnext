const express = require("express");
const next = require("next");
const path = require("path");
const compression = require("compression");

require("dotenv").config();

const backendApp = require("./backend/index");

const dev = process.env.NODE_ENV !== "production";

const app = next({
  dev,
  dir: path.join(__dirname, "frontend"),
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(compression());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Global No-Index, No-Follow for search engines
  server.use((req, res, next) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    next();
  });

  // Backend API
  server.use("/v1", backendApp);

  // expose JSON data folder
  server.use("/backend/data", express.static(path.join(__dirname, "Backend/data")));

  // expose uploads folder from backend
  server.use("/uploads", express.static(path.join(__dirname, "Backend/assets/uploads")));

  // Next frontend
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, () => {
    console.log("Server running on port 3000");
  });
});