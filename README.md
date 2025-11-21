# Student–Teacher Appointment Booking System

This **Web-Based Appointment Booking System** allows students to schedule appointments with teachers online. The system improves communication, reduces queueing, and ensures both students and teachers are aware of appointment timings anywhere using a mobile or web browser.

The project is built using **HTML, CSS, JavaScript, and Firebase**, with modular, maintainable, testable, and portable code.

---

## 📌 Problem Statement

Traditional appointment systems (manual registers or queues) create long waiting times and communication gaps.
This project provides a **web-based, real-time appointment booking system** where:

* Students can search teachers, book appointments, and send messages.
* Teachers can approve/cancel appointments and view messages.
* Admin can manage teacher records and approve user registrations.

The system is designed to be accessible anytime from any device connected to the internet.

---

# 🚀 Features

---

## 👨‍💼 **Admin Module**

* Add Teacher (Name, Department, Subject, etc.)
* Update/Delete Teacher details
* Approve or Reject Teacher/Student registrations
* View all users and appointments
* Secure Login / Logout

---

## 👨‍🏫 **Teacher Module**

* Login
* View appointment requests
* Approve / Cancel appointments
* View student messages
* View all scheduled appointments
* Logout

---

## 👨‍🎓 **Student Module**

* Register & Login
* Search teacher by name/department/subject
* Book appointment (select date, time, purpose)
* Send message to teacher
* View appointment status
* Logout

---

# 🛠️ Technologies Used

* **HTML5** – Pages and Layout
* **CSS3** – Styling and UI responsiveness
* **JavaScript** – Frontend logic, form validation, event handling
* **Firebase Authentication** – Login/Signup
* **Firebase Firestore** – Store users, teachers, appointments, messages
* **Firebase Hosting** (optional) – Deployment
* **JavaScript Logging Library** – Action logs stored for debugging

---

# 📂 System Modules Overview

### 1️⃣ **Authentication**

* Firebase Authentication used for Students, Teachers & Admin
* Validation for email/password formats
* Logging on every login, signup, logout

### 2️⃣ **Teacher Management (Admin)**

* CRUD operations on teacher data
* All teachers stored in Firestore

### 3️⃣ **Appointment Management**

* Student → Book Appointment
* Teacher → Approve / Cancel
* Auto-update UI in real-time using Firebase listener

### 4️⃣ **Messaging**

* Students send messages related to appointments
* Teacher can view messages anytime

### 5️⃣ **Search**

* Search teachers by:

  * Name
  * Subject
  * Department

### 6️⃣ **Logging**

For every action:

* Login / Logout
* Appointment Booked
* Appointment Approved / Cancelled
* Message Sent
* Registration Approved
  Logs stored using JavaScript logging library + Firebase.

---



# 🔧 Code Qualities Ensured

* **Modular Code:** Components split into modules (auth.js, booking.js, admin.js).
* **Safe:** Validations + Firebase security rules.
* **Maintainable:** Clear folder structure + clean code.
* **Testable:** Each module can be unit-tested individually.
* **Portable:** Works on any OS (web-based).

---
