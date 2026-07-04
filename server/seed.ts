import { db, initDb } from "./db.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// We'll read the mockData from the frontend code directly or reproduce it here
// To keep it simple, we'll recreate the core data to insert it.
const defaultPassword = bcrypt.hashSync("Password@123", 10);

const employees = [
  { id: "emp-1", name: "Arjun Mehta", email: "arjun@sentinel.ai", department: "Engineering", role: "employee", initials: "AM", color: "#4ade80", status: "online", joinDate: "2024-03-15", phone: "+91 98765 43210", address: "42 MG Road, Bangalore, KA 560001", designation: "Software Engineer", managerId: "emp-5" },
  { id: "emp-2", name: "Priya Sharma", email: "priya@sentinel.ai", department: "Design", role: "employee", initials: "PS", color: "#60a5fa", status: "online", joinDate: "2024-01-10", phone: "+91 98765 43211", address: "15 Koramangala, Bangalore, KA 560034", designation: "UI/UX Designer", managerId: "emp-5" },
  { id: "emp-5", name: "Vikram Singh", email: "vikram@sentinel.ai", department: "Engineering", role: "manager", initials: "VS", color: "#a78bfa", status: "online", joinDate: "2023-05-12", phone: "+91 98765 43214", address: "12 Whitefield, Bangalore, KA 560066", designation: "Engineering Manager", managerId: null },
  { id: "emp-6", name: "Ananya Iyer", email: "ananya@sentinel.ai", department: "HR", role: "hr", initials: "AI", color: "#fb923c", status: "online", joinDate: "2023-08-25", phone: "+91 98765 43215", address: "7 JP Nagar, Bangalore, KA 560078", designation: "HR Manager", managerId: null },
];

const documents = [
  { id: "d-1", userId: "emp-1", name: "Aadhar Card", type: "Identity", uploadedAt: "2024-03-15" },
  { id: "d-2", userId: "emp-1", name: "PAN Card", type: "Tax", uploadedAt: "2024-03-15" },
];

const payrolls = [
  { id: "pay-1", employeeId: "emp-1", baseSalary: 85000, hra: 34000, specialAllowance: 15000, conveyance: 2000, medical: 1500, grossSalary: 137500, status: "paid" },
  { id: "pay-5", employeeId: "emp-5", baseSalary: 120000, hra: 48000, specialAllowance: 25000, conveyance: 2000, medical: 1500, grossSalary: 196500, status: "processing" },
];

console.log("Initializing DB schema...");
initDb();

console.log("Clearing existing data...");
db.exec("DELETE FROM payroll");
db.exec("DELETE FROM attendance");
db.exec("DELETE FROM leave_requests");
db.exec("DELETE FROM documents");
db.exec("DELETE FROM users");

console.log("Seeding users...");
const insertUser = db.prepare("INSERT INTO users (id, name, email, password, department, role, initials, color, status, joinDate, phone, address, designation, managerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
for (const emp of employees) {
  insertUser.run(emp.id, emp.name, emp.email, defaultPassword, emp.department, emp.role, emp.initials, emp.color, emp.status, emp.joinDate, emp.phone, emp.address, emp.designation, emp.managerId);
}

console.log("Seeding documents...");
const insertDoc = db.prepare("INSERT INTO documents (id, userId, name, type, uploadedAt) VALUES (?, ?, ?, ?, ?)");
for (const doc of documents) {
  insertDoc.run(doc.id, doc.userId, doc.name, doc.type, doc.uploadedAt);
}

console.log("Seeding payroll...");
const insertPay = db.prepare("INSERT INTO payroll (id, employeeId, baseSalary, hra, specialAllowance, conveyance, medical, grossSalary, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
for (const pay of payrolls) {
  insertPay.run(pay.id, pay.employeeId, pay.baseSalary, pay.hra, pay.specialAllowance, pay.conveyance, pay.medical, pay.grossSalary, pay.status);
}

console.log("Seed complete! Test users:");
console.log("- HR: ananya@sentinel.ai / Password@123");
console.log("- Employee: arjun@sentinel.ai / Password@123");
