import { auth, provider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom"; 
import { signOut } from "firebase/auth";
import { useGetUserInfo } from "../../hook/useGetUserInfo";

const Auth = ({force}) => {
  const navigate = useNavigate();
  const { isAuth } = useGetUserInfo();
//   console.log(force);

  const signInWithGoogle = async () => {
    const results = await signInWithPopup(auth, provider);
    const authInfo = {
      userID: results.user.uid,
      name: results.user.displayName,
      profilePhoto: results.user.photoURL,
      isAuth: true,
    };
    localStorage.setItem("auth", JSON.stringify(authInfo));
    navigate("/map")
  }

  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/")
    } catch {
      console.error(err);
    }
  };



  if (isAuth && force == false) {
    return <>
      <button className="sign-out-button" onClick={signUserOut}>
        Sign Out
      </button>
    </>
  }

  return <>
  <div className="login-button">
    <button className="login-with-google-btn" onClick={signInWithGoogle}>
      Sign In With Google
    </button>
  </div>
  </>
}

export default Auth;