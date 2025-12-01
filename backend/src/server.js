import express from "express";
import cors from "cors";

import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(clerkMiddleware()); // Clerk Middleware
// app.use(arcjetMiddleware); // Arcjet Middleware

app.get("/", (req, res) => {
  res.send("Hello From Server");
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

// error handling middleware
app.use((err, req, res) => {
  console.error("unhandled error", err);
  res.status(500).json({ error: err.message || "internal server error" });
});

const startServer = async () => {
  try {
    await connectDB();

    // deploy : listen for local development
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () =>
        console.log("Server running on port:", ENV.PORT)
      );
    }
  } catch (error) {
    console.log("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// deploy : export for vercel
export default app;
