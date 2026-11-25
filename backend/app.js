import express from "express";
import cors from "cors";
import Post from "./models/Post.js";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.get("/api/posts", async (_req, res) => {
  try { res.json(await Post.find().sort({ createdAt: -1 })); } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post("/api/posts", async (req, res) => {
  try { res.status(201).json(await Post.create(req.body)); } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete("/api/posts/:id", async (req, res) => {
  try { await Post.findByIdAndDelete(req.params.id); res.json({ deleted: true }); } catch (e) { res.status(400).json({ error: e.message }); }
});
export default app;
