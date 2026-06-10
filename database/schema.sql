-- ============================================
-- College Placement Management Portal
-- Database Schema + Sample Data
-- ============================================

CREATE DATABASE IF NOT EXISTS placement_portal;
USE placement_portal;

-- ============================================
-- TABLE: students
-- ============================================
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  cgpa DECIMAL(3,2) NOT NULL,
  branch VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: admin
-- ============================================
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- ============================================
-- TABLE: companies
-- ============================================
CREATE TABLE IF NOT EXISTS companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  package DECIMAL(5,2) NOT NULL,  -- in LPA
  min_cgpa DECIMAL(3,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: applications
-- ============================================
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  company_id INT NOT NULL,
  status ENUM('Applied', 'Under Review', 'Shortlisted', 'Selected', 'Rejected') DEFAULT 'Applied',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE KEY unique_application (student_id, company_id)
);

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Admin (password: admin123)
INSERT INTO admin (username, password) VALUES
('admin', '$2a$10$zDg4K5XwpG0Rksf5vlwy6OKoaWQB2a6PYKwwKYbtIImGLk5MUw3vW');

-- Students (password for all: password123)
INSERT INTO students (name, email, password, cgpa, branch) VALUES
('Arjun Sharma',    'arjun@college.edu',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh.2', 8.50, 'Computer Science'),
('Priya Patel',     'priya@college.edu',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh.2', 7.80, 'Information Technology'),
('Rahul Mehta',     'rahul@college.edu',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh.2', 9.10, 'Computer Science'),
('Sneha Reddy',     'sneha@college.edu',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh.2', 6.90, 'Electronics'),
('Vikram Singh',    'vikram@college.edu',  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh.2', 7.20, 'Mechanical'),
('Ananya Iyer',     'ananya@college.edu',  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh.2', 8.90, 'Computer Science'),
('Karan Joshi',     'karan@college.edu',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh.2', 7.50, 'Information Technology'),
('Meera Nair',      'meera@college.edu',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh.2', 8.20, 'Electronics');

-- Companies
INSERT INTO companies (company_name, role, package, min_cgpa, description) VALUES
('Google',          'Software Engineer',        45.00, 8.50, 'Join Google and work on products used by billions. Strong DSA required.'),
('Microsoft',       'SDE-1',                    38.00, 8.00, 'Work on cutting-edge cloud and enterprise solutions at Microsoft Azure.'),
('Infosys',         'Systems Engineer',         6.50,  6.00, 'Start your IT career with one of India''s top IT companies.'),
('TCS',             'Assistant Systems Engineer',5.50, 5.50, 'Begin your journey with TCS, India''s largest IT employer.'),
('Wipro',           'Project Engineer',          6.00, 6.00, 'Work on diverse technology projects across global clients.'),
('Amazon',          'SDE-1',                    35.00, 8.00, 'Build the future of e-commerce and cloud computing at Amazon.'),
('Accenture',       'Associate Software Engineer',7.00, 6.50, 'Consulting and technology solutions across industries.'),
('Flipkart',        'Software Developer',       18.00, 7.50, 'Work on India''s largest e-commerce platform engineering team.');

-- Sample Applications
INSERT INTO applications (student_id, company_id, status) VALUES
(1, 1, 'Shortlisted'),
(1, 2, 'Applied'),
(2, 5, 'Under Review'),
(3, 1, 'Applied'),
(3, 6, 'Applied'),
(6, 2, 'Selected'),
(7, 5, 'Applied'),
(4, 3, 'Under Review'),
(4, 4, 'Applied'),
(8, 8, 'Shortlisted');
