const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");

app.use(express.json());
app.use(cors());
// dotenv.config();
dotenv.config({ path: "./config.env" });

// Connect to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Check if db connection works
db.connect((err) => {
    if (err) {
        console.error("Error connecting to mysql db: ", err);
        process.exit(1); // Exit the process if connection fails
    } else {
        console.log("Connected to mysql successfully as id: ", db.threadId);

        // Dynamic Part
        app.set("view engine", "ejs");
        app.set("views", __dirname + "/views");

        // Retrieve all patients
        app.get("/patients", (req, res) => {
            // Retrieve data from database
            db.query("SELECT * FROM patients", (err, results) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error Retrieving data");
                } else {
                    // Display the records to the browser
                    res.render("patients", { results });
                }
            });
        });

        // Retrieve all providers
        app.get("/providers", (req, res) => {
            db.query("SELECT * FROM providers", (err, results) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error Retrieving data");
                } else {
                    // Display the records to the browser
                    res.render("providers", { results });
                }
            });
        });

        //  Filter patients by First Name
        // Retrieve patients by firstname
        app.get("/filter1", (req, res) => {
            const { firstName } = req.query;

            const query = "SELECT * FROM patients WHERE first_name = ? ";

            db.query(query, [firstName], (err, results) => {
                if (err) {
                    console.error(err);
                    res.status(500).send({ error: "Error Retrieving Data" });
                } else {
                    // Display the records to the browser
                    res.render("filter1", { results });
                }
            });
        });

        // Retrieve all providers by their specialty
        // Retrieve providers by speciality
        app.get("/filter2", (req, res) => {
            const { specialty } = req.query;

            const query =
                "SELECT * FROM providers WHERE provider_specialty = ? ";

            db.query(query, [specialty], (err, results) => {
                if (err) {
                    console.error(err);
                    res.status(500).send({ error: "Error Retrieving Data" });
                } else {
                    // Display the records to the browser
                    res.render("filter2", { results });
                }
            });
        });

        app.listen(process.env.DB_PORT, () => {
            console.log(`Server listening on port ${process.env.DB_PORT}`);

            // Send a message to the browser
            console.log("Sending message to the browser...");
            app.get("/", (req, res) => {
                res.send("Server Started Successfully!!!");
            });
        });
    }
});
