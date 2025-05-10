// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // لإدارة قاعدة البيانات Firestore
import { getStorage } from "firebase/storage"; // لو قررتي تستخدمين Storage مستقبلاً
import { getAuth } from "firebase/auth"; // لإضافة التحقق من الهوية

const firebaseConfig = {
  apiKey: "AIzaSyCmuokrFOcGoZwvObw3aOpt2vM3t4FkP4w",
  authDomain: "lacite-store-c3612.firebaseapp.com",
  projectId: "lacite-store-c3612",
  storageBucket: "lacite-store-c3612.appspot.com",
  messagingSenderId: "524761495605",
  appId: "1:524761495605:web:70b200d58dd9717e9c197c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore (قاعدة البيانات)
const db = getFirestore(app);

// Authentication (التحقق من الهوية)
const auth = getAuth(app);

// Storage (لتخزين الملفات مثل الصور)
const storage = getStorage(app);

// إذا كنت تريد فقط مسؤول واحد يمكن استخدام adminUID
// ملاحظة: استخدام هذا مع أكثر من مسؤول ليس الحل الأمثل
export const adminUID = "EgSXe18P6ShNkpStyr3tcyt3ME82"; // معرف مسؤول ثابت

export { db, storage, auth }; // تصدير الوظائف
