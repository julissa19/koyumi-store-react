import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  async function signup(email, password) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const newUser = userCredential.user;

    await setDoc(doc(db, "usuarios", newUser.uid), {
      email: newUser.email,
      rol: "user",
      creadoEn: new Date().toISOString()
    });

    return newUser;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoadingAuth(false);
        return;
      }

      try {
        const userDocRef = doc(db, "usuarios", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            ...userDocSnap.data()
          });
        } else {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            rol: "user"
          });
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);

        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          rol: "user"
        });
      } finally {
        setLoadingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loadingAuth,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loadingAuth && children}
    </AuthContext.Provider>
  );
}