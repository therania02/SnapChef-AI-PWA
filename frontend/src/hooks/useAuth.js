import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  signInWithEmailAndPassword 
} from "firebase/auth";
import { auth, provider } from "../api/firebase";

export const useAuth = () => {

  const register = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // simpan nama user
    await updateProfile(userCredential.user, {
      displayName: name,
    });
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    return signInWithPopup(auth, provider);
  };

  return { register, login, loginWithGoogle };
};