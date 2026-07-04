import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "./db.js";

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

app.use(cors());
app.use(express.json());

// --- Auth Middleware ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const requireHR = (req: any, res: any, next: any) => {
  if (req.user?.role !== "hr") return res.status(403).json({ error: "HR access required" });
  next();
};

// --- Routes ---

// 1. Auth: Login
app.post("/api/auth/login", (req, res) => {
  const { email, password, role } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;

  if (!user) return res.status(400).json({ error: "Invalid email or password." });
  if (role === "hr" && user.role !== "hr") return res.status(403).json({ error: "This account doesn't have HR access." });
  
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid email or password." });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name, initials: user.initials, color: user.color }, JWT_SECRET, { expiresIn: "24h" });
  res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
});

// 2. Auth: Register
app.post("/api/auth/register", (req, res) => {
  const { employeeId, email, password, role } = req.body;
  try {
    const existing = db.prepare("SELECT * FROM users WHERE email = ? OR id = ?").get(email, employeeId);
    if (existing) return res.status(400).json({ error: "User already exists with this email or ID." });

    const hash = bcrypt.hashSync(password, 10);
    const initials = email.substring(0, 2).toUpperCase();
    const color = "#60a5fa"; // default color
    
    db.prepare(`
      INSERT INTO users (id, name, email, password, department, role, initials, color, status, joinDate, phone, address, designation, managerId) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(employeeId, "New User", email, hash, "General", role, initials, color, "online", new Date().toISOString().split("T")[0], "", "", "Employee", null);
    
    res.status(201).json({ message: "Account created successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Employees (GET / PUT)
app.get("/api/employees", authenticateToken, (req, res) => {
  const users = db.prepare("SELECT id, name, email, department, role, initials, color, status, joinDate, phone, address, designation, managerId FROM users").all();
  res.json(users);
});

app.get("/api/employees/:id", authenticateToken, (req: any, res) => {
  const { id } = req.params;
  const user = db.prepare("SELECT id, name, email, department, role, initials, color, status, joinDate, phone, address, designation, managerId FROM users WHERE id = ?").get(id) as any;
  if (!user) return res.status(404).json({ error: "User not found" });

  const documents = db.prepare("SELECT * FROM documents WHERE userId = ?").all(id);
  res.json({ ...user, documents });
});

app.put("/api/employees/:id", authenticateToken, (req: any, res) => {
  const { id } = req.params;
  if (req.user.id !== id && req.user.role !== "hr") {
    return res.status(403).json({ error: "Unauthorized to edit this profile" });
  }
  
  const { phone, address, name, department, designation } = req.body;
  
  if (req.user.role === "hr") {
    // HR can update more fields
    db.prepare("UPDATE users SET phone = ?, address = ?, name = ?, department = ?, designation = ? WHERE id = ?")
      .run(phone ?? "", address ?? "", name, department, designation, id);
  } else {
    // Employee can only update basic contact info
    db.prepare("UPDATE users SET phone = ?, address = ? WHERE id = ?").run(phone ?? "", address ?? "", id);
  }
  
  res.json({ success: true });
});

// 4. Attendance
app.get("/api/attendance", authenticateToken, (req: any, res) => {
  if (req.user.role === "hr") {
    const records = db.prepare("SELECT * FROM attendance").all();
    res.json(records);
  } else {
    const records = db.prepare("SELECT * FROM attendance WHERE employeeId = ?").all(req.user.id);
    res.json(records);
  }
});

// For mock purposes, simplistic Check In / Out
app.post("/api/attendance/checkin", authenticateToken, (req: any, res) => {
  const date = new Date().toISOString().split("T")[0];
  const time = new Date().toLocaleTimeString("en-US", { hour12: false });
  const id = Date.now().toString();

  db.prepare("INSERT INTO attendance (id, employeeId, date, checkIn, status) VALUES (?, ?, ?, ?, ?)").run(id, req.user.id, date, time, "present");
  res.json({ success: true, id, checkIn: time });
});

app.post("/api/attendance/checkout", authenticateToken, (req: any, res) => {
  const { id } = req.body;
  const time = new Date().toLocaleTimeString("en-US", { hour12: false });
  db.prepare("UPDATE attendance SET checkOut = ? WHERE id = ? AND employeeId = ?").run(time, id, req.user.id);
  res.json({ success: true, checkOut: time });
});

// 5. Leave
app.get("/api/leave", authenticateToken, (req: any, res) => {
  if (req.user.role === "hr") {
    res.json(db.prepare("SELECT * FROM leave_requests").all());
  } else {
    res.json(db.prepare("SELECT * FROM leave_requests WHERE employeeId = ?").all(req.user.id));
  }
});

app.post("/api/leave", authenticateToken, (req: any, res) => {
  const { type, startDate, endDate, reason } = req.body;
  const id = "lr-" + Date.now();
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  db.prepare(`
    INSERT INTO leave_requests (id, employeeId, employeeName, type, startDate, endDate, days, status, reason)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.user.id, req.user.name, type, startDate, endDate, days, "pending", reason);
  
  res.status(201).json({ success: true });
});

app.patch("/api/leave/:id/status", authenticateToken, requireHR, (req: any, res) => {
  const { id } = req.params;
  const { status, hrComment } = req.body;
  db.prepare("UPDATE leave_requests SET status = ?, hrComment = ? WHERE id = ?").run(status, hrComment, id);
  res.json({ success: true });
});

// 6. Payroll
app.get("/api/payroll", authenticateToken, (req: any, res) => {
  if (req.user.role === "hr") {
    res.json(db.prepare("SELECT * FROM payroll").all());
  } else {
    res.json(db.prepare("SELECT * FROM payroll WHERE employeeId = ?").all(req.user.id));
  }
});

app.put("/api/payroll/:id", authenticateToken, requireHR, (req: any, res) => {
  const { id } = req.params;
  const { baseSalary, hra, specialAllowance, conveyance, medical, status } = req.body;
  const grossSalary = Number(baseSalary) + Number(hra) + Number(specialAllowance) + Number(conveyance) + Number(medical);
  
  db.prepare(`
    UPDATE payroll 
    SET baseSalary = ?, hra = ?, specialAllowance = ?, conveyance = ?, medical = ?, grossSalary = ?, status = ?
    WHERE id = ?
  `).run(baseSalary, hra, specialAllowance, conveyance, medical, grossSalary, status, id);
  
  res.json({ success: true, grossSalary });
});

app.listen(PORT, () => {
  console.log(`HRMS Backend running on http://localhost:${PORT}`);
});
