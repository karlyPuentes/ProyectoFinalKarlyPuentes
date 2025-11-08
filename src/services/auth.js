import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// 🔹 Registrar usuario y guardar su rol
export async function registerUser({ email, password, displayName, role = "reportero" }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(cred.user, { displayName });

  // Guardar datos del usuario + rol en Firestore
  await setDoc(doc(db, "users", cred.user.uid), {
    name: displayName,
    email,
    role,
    createdAt: serverTimestamp(), // 🔸 Usa timestamp de Firestore
  });

  return cred.user;
}

// 🔹 Iniciar sesión
export async function loginUser({ email, password }) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

// 🔹 Obtener documento del usuario (para conocer su rol)
export async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

// 🔹 Cerrar sesión (opcional, útil para tu botón “Salir”)
export async function logoutUser() {
  await signOut(auth);
}

// 🔹 Detectar cambios en autenticación (opcional si no lo tienes en el contexto)
export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
