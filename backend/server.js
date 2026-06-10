const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/enroll", require("./routes/enrollRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));           // NEW
app.use("/api/announcements", require("./routes/announcementRoutes")); // NEW

app.get("/", (req, res) => res.json({ message: "Learn.in API running!" }));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch(err => { console.error("❌ MongoDB error:", err.message); process.exit(1); });