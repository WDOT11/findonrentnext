/** This is root file of our node application */
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

/** Import all custom files */
require('./config/global_constants');
require('dotenv').config();
require('./utility');

/** Run the footer cron */
require("./utils/footerCron");

/** enable cors to fetch api call from cross origin */
app.use(cors());
app.use(express.json());

/** Body parser middleware */
app.use(express.json()); // <-- Use this middleware to parse JSON
app.use(express.urlencoded({ extended: true })); // <-- For URL-encoded data (optional)
app.use('/uploads', express.static(path.join(__dirname, 'assets/uploads')));

/** Serve static files from the "data" directory */
app.use("/data", express.static("data"));

/**  Import database connection(Directly import the promisePool here) */
const pool = require('./config/connection');

/** Configure routes with the database connection */
const routes = require('./routes/web');
routes.configure(app, pool); // Pass pool to your routes for DB interaction

/** start server listen on specified host and server */
const port = process.env.PORT || 3000;

/*
var server = app.listen(port, function () {
    console.log(`Server is running on port ${port}`);
});
*/
module.exports = app;

/** Function to get unhandled errors and prevent to stop nodejs server **/
process.on("uncaughtException", function (err) {
	console.log("error name ---------" + err.name);
	console.log("error date ---------" + new Date());
	console.log("error message ---------" + err.message);
	console.log("error stack ---------" + err.stack);
	setTimeout(function(){
        // process.exit(1);
    }, 1000);
});
