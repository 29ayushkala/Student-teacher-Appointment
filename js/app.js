import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBumpFJY2f1sMeYZaL-lg5vg3LwGzmR1Ko",
  authDomain: "appointment-booker-a0ffc.firebaseapp.com",
  projectId: "appointment-booker-a0ffc",
  storageBucket: "appointment-booker-a0ffc.firebasestorage.app",
  messagingSenderId: "1072239809607",
  appId: "1:1072239809607:web:32eb3c946d864d8226cd62"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ------------------ REGISTER ------------------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    try {
      console.log("Registering user...");

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      console.log("User created:", uid);

      await setDoc(doc(db, "users", uid), {
        name,
        email,
        role,
        approved: role === "student" ? false : true,
        createdAt: new Date()
      });

      console.log("User saved to Firestore");

      alert("Registration successful!");
      window.location.href = "login.html";

    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed: " + error.message);
    }
  });
}

// ------------------ LOGIN ------------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredential)
      const uid = userCredential.user.uid;
      console.log(uid);
      const userSnap = await getDoc(doc(db, "users", uid)) || await getDoc(doc(db, "teachers", uid));
      if (!userSnap.exists()) throw new Error("User data not found.");

      const userData = userSnap.data();
      if (userData.role !== role) throw new Error("Selected role does not match account.");
      if (userData.role === "student" && !userData.approved)
        throw new Error("Approval pending.");

      if (userData.role === "admin") window.location.href = "admin.html";
      else window.location.href = "dashboard.html";
    } catch (error) {
      alert(`ERROR: ${error.message}`);
    }
  });
}

// ------------------ LOGOUT ------------------
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}

// ------------------ ADMIN PAGE ------------------
const addTeacherForm = document.getElementById("addTeacherForm");
const teachersList = document.getElementById("teachersList");
const pendingStudents = document.getElementById("pendingStudents");
const allAppointments = document.getElementById("allAppointments");

if (addTeacherForm) {
  addTeacherForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("t_name").value.trim();
    const dept = document.getElementById("t_dept").value.trim();
    const subject = document.getElementById("t_subject").value.trim();
    const email = document.getElementById("t_email").value.trim();
    const password = document.getElementById("t_password").value.trim();
    // create a new teacher UID manually
    try {
      //  Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      //  Add to "teachers" collection with same UID
      await setDoc(doc(db, "teachers", uid), {
        name,
        email,
        dept,
        subject,
        role: "teacher",
        createdAt: new Date()
      });

      // Also add to "users" collection with same UID
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        role: "teacher",
        approved: true,
        createdAt: new Date()
      });

      alert("Teacher added successfully!");
      addTeacherForm.reset();
      await loadTeachers();
    } catch (error) {
      console.error("Error adding teacher:", error);
      alert("Failed to add teacher: " + error.message);
    }
  });

  async function loadTeachers() {
    teachersList.innerHTML = "";
    const snap = await getDocs(collection(db, "teachers"));
    snap.forEach((d) => {
      const t = d.data();
      teachersList.innerHTML += `<div><strong>${t.name}</strong> ${t.dept || ""} ${t.subject || ""}</div>`;
    });
  }

  async function loadPendingStudents() {
    pendingStudents.innerHTML = "";
    const q = query(
      collection(db, "users"),
      where("role", "==", "student"),
      where("approved", "==", false)
    );
    const snap = await getDocs(q);
    snap.forEach((d) => {
      const s = d.data();
      const el = document.createElement("div");
      el.innerHTML = `${s.name} (${s.email}) <button data-id='${d.id}' class='approveBtn'>Approve</button>`;
      pendingStudents.appendChild(el);
    });

    pendingStudents.addEventListener("click", async (ev) => {
      if (ev.target.matches(".approveBtn")) {
        const sid = ev.target.dataset.id;
        await updateDoc(doc(db, "users", sid), { approved: true });
        ev.target.closest("div").remove();
      }
    });
  }

  async function loadAppointments() {
    allAppointments.innerHTML = "";
    const snap = await getDocs(collection(db, "appointments"));
    snap.forEach((d) => {
      const a = d.data();
      allAppointments.innerHTML += `<div>${a.studentName} → ${a.teacherName} (${a.date} ${a.time})</div>`;
    });
  }

  onAuthStateChanged(auth, (user) => {
    if (!user) return (window.location.href = "login.html");
    loadTeachers();
    loadPendingStudents();
    loadAppointments();
  });
}

// ------------------ DASHBOARD PAGE ------------------
const studentSection = document.getElementById("studentSection");
const teacherSection = document.getElementById("teacherSection");

if (studentSection || teacherSection) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return (window.location.href = "login.html");
    const uid = user.uid;
    const userSnap = await getDoc(doc(db, "users", uid));
    if (!userSnap.exists()) return (window.location.href = "login.html");
    const profile = userSnap.data();

    if (profile.role === "student") {
      console.log(uid);
      studentSection.style.display = "block";
      teacherSection.style.display = "none";
      await renderTeachers(uid, profile);
      await renderMyAppointments(uid);
    } else if (profile.role === "teacher") {
      console.log(uid);
      teacherSection.style.display = "block";
      studentSection.style.display = "none";
      await renderIncomingAppointments(uid);
    }
  });

  // Student functions
  async function renderTeachers(uid, profile) {
    const container = document.getElementById("teacherList");
    container.innerHTML = "";
    const snap = await getDocs(collection(db, "teachers"));
    console.log(snap);
    snap.forEach((d) => {
      const t = d.data();
      const el = document.createElement("div");
      el.innerHTML = `<strong>${t.name}</strong> ${t.dept || ""} ${t.subject || ""} 
        <button data-id='${d.id}' class='bookBtn'>Book</button>`;
      container.appendChild(el);
    });

    container.addEventListener("click", async (ev) => {
      if (!ev.target.matches(".bookBtn")) return;
      const teacherId = ev.target.dataset.id;
      const date = prompt("Enter date (YYYY-MM-DD)");
      const time = prompt("Enter time (HH:MM)");
      const purpose = prompt("Purpose");
      if (!date || !time || !purpose) return;
      
      const teacherSnap = await getDoc(doc(db, "teachers", teacherId));
      const teacherData = teacherSnap.data();

      await addDoc(collection(db, "appointments"), {
        studentId: uid,
        studentName: profile.name,
        teacherId,
        teacherName: teacherData.name,
        date,
        time,
        purpose,
        status: "pending",
        createdAt: serverTimestamp()
      });

      alert("Appointment booked!");
      await renderMyAppointments(uid);
    });
  }

  async function renderMyAppointments(uid) {
    const container = document.getElementById("myAppointments");
    container.innerHTML = "";
    const q = query(
      collection(db, "appointments"),
      where("studentId", "==", uid),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    snap.forEach((d) => {
      const a = d.data();
      container.innerHTML += `<div>${a.date} ${a.time} - ${a.purpose} - <strong>${a.status}</strong></div>`;
    });
  }

  // Teacher functions
  async function renderIncomingAppointments(uid) {
    const container = document.getElementById("incomingAppointments");
    container.innerHTML = "";
    const q = query(
      collection(db, "appointments"),
      where("teacherId", "==", uid),
      orderBy("createdAt", "desc")
    );
    console.log(q);
    const snap = await getDocs(q);
    snap.forEach((d) => {
      const a = d.data();
      const el = document.createElement("div");
      el.innerHTML = `${a.date} ${a.time} - ${a.purpose} - <strong>${a.status}</strong>
        <button data-id='${d.id}' class='approveBtn'>Approve</button>
        <button data-id='${d.id}' class='cancelBtn'>Cancel</button>`;
      container.appendChild(el);
    });

    container.addEventListener("click", async (ev) => {
      if (ev.target.matches(".approveBtn") || ev.target.matches(".cancelBtn")) {
        const id = ev.target.dataset.id;
        const status = ev.target.matches(".approveBtn") ? "approved" : "cancelled";
        await updateDoc(doc(db, "appointments", id), { status });
        await renderIncomingAppointments(uid);
      }
    });
  }
}
