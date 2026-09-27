const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000; // Best practice: allow dynamic environment ports

/**
 * Allowed Origin Configuration
 */
const allowedOrigins = ["http://localhost:5173", "https://www.google.com"];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server, mobile apps, and Postman (no origin header)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      // Pass a generic message or handle smoothly without crashing the server
      return callback(new Error("Blocked by CORS policy."));
    }
  },
  optionsSuccessStatus: 200, // Good practice for legacy browser compatibility (IE11/smart TVs)
};

/**
 * Express Built-in Middleware & CORS
 * - Placed at the top so it processes all incoming routing paths
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions)); // Capitalization changed to lowercase variable for standard convention

// Routes
app.get("/", (req, res) => {
  res.send("This is the home page");
});

// mount the routes
app.use('/api' , routes)

/**
 * Centralized Error Handling Middleware
 * - Catch CORS errors cleanly instead of crashing the Node process
 */
app.use((err, req, res, next) => {
  if (err.message === "Blocked by CORS policy.") {
    return res.status(403).json({ error: err.message });
  }
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
