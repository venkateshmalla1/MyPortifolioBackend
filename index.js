// --- Load Environment Variables ---
require('dotenv').config();

// --- Imports ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Error:", err.message));

// --- Schemas & Models ---
const certificateSchema = new mongoose.Schema({
  title: String,
  issuedBy: String,
  issuedOn: String,
  technologiesCovered: [String],
  thumbnail: String,
  verificationUrl: String
});

const projectSchema = new mongoose.Schema({
  title: String,
  category: String,
  technologiesUsed: [String],
  description: String,
  thumbnail: String,
  liveLink: String,
  githubRepo: String
});

const Certificate = mongoose.model('Certificate', certificateSchema, 'certificates');
const Project = mongoose.model('Project', projectSchema, 'projects');

// --- Routes ---
// Status check
app.get('/api/status', (req, res) => {
  res.json({
    message: "Server is alive!",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// Certificates CRUD
app.get('/api/certificates', async (req, res) => {
  try {
    const certs = await Certificate.find();
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/certificates/:id', async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ error: "Certificate not found" });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/certificates', async (req, res) => {
  try {
    const newCert = new Certificate(req.body);
    await newCert.save();
    res.status(201).json(newCert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/certificates/:id', async (req, res) => {
  try {
    const updatedCert = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCert) return res.status(404).json({ error: "Certificate not found" });
    res.json(updatedCert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/certificates/:id', async (req, res) => {
  try {
    const deletedCert = await Certificate.findByIdAndDelete(req.params.id);
    if (!deletedCert) return res.status(404).json({ error: "Certificate not found" });
    res.json({ message: "Certificate deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Projects CRUD
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProject) return res.status(404).json({ error: "Project not found" });
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/status', (req, res) => {
  res.json({
    message: "Server is alive!",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// --- Start Server ---
const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server active at http://localhost:${PORT}`);
});
