import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
const PORT = process.env.PORT || 5000;
const URI = process.env.MONGO_URI || "mongodb://localhost:27017/blogdb";
// Start listening first so Cloud Run health check passes; Mongo connects in background
app.listen(PORT, "0.0.0.0", () => console.log(`API running on ${PORT}`));
mongoose.connect(URI).then(() => console.log("MongoDB connected")).catch((e) => console.error("Mongo error:", e.message));
