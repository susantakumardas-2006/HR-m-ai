import { DatabaseSync } from "node:sqlite";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, "hrms.db");

// Initialize database
export const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec("PRAGMA foreign_keys = ON;");

// Define schema
export const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      department TEXT NOT NULL,
      role TEXT NOT NULL,
      initials TEXT NOT NULL,
      color TEXT NOT NULL,
      status TEXT NOT NULL,
      joinDate TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      designation TEXT,
      managerId TEXT,
      FOREIGN KEY (managerId) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      uploadedAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS leave_requests (
      id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      employeeName TEXT NOT NULL,
      type TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      days INTEGER NOT NULL,
      status TEXT NOT NULL,
      reason TEXT NOT NULL,
      hrComment TEXT,
      FOREIGN KEY (employeeId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      date TEXT NOT NULL,
      checkIn TEXT,
      checkOut TEXT,
      hours TEXT,
      status TEXT NOT NULL,
      FOREIGN KEY (employeeId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS payroll (
      id TEXT PRIMARY KEY,
      employeeId TEXT UNIQUE NOT NULL,
      baseSalary INTEGER NOT NULL,
      hra INTEGER NOT NULL,
      specialAllowance INTEGER NOT NULL,
      conveyance INTEGER NOT NULL,
      medical INTEGER NOT NULL,
      grossSalary INTEGER NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY (employeeId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
};
