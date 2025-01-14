import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Basic test route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running, " + new Date().toISOString() });
});

app.get("/api/user", async (req, res) => {
  const response = await prisma.user.findMany();
  res.json(response);
});

app.post("/api/user", async (req, res) => {
  try {
    const response = await prisma.user.create({ data: req.body });
    res.json(response);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.patch("/api/user/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const response = await prisma.user.update({ where: { id }, data: req.body });
  res.json(response);
});

app.delete("/api/user/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await prisma.user.delete({ where: { id } });
  res.json({});
});

app.get("/api/user/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const response = await prisma.user.findUnique({ where: { id } });
  res.json(response);
});

app.get("/", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
