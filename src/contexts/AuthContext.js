import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
//import firebase from "../firebase";
//import { useHistory } from "react-router-dom";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  //const history = useHistory();
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  /*
//Sign up function
  function signUp(email, password) {
    //***SELF-REMINDER: POSSIBLE TO CHANGE THIS TO A DIFF BACKEND IF NEEDED
    return auth.createUserWithEmailAndPassword(email, password);
  }

  //Login function
  function login() {
    //***SELF-REMINDER: POSSIBLE TO CHANGE THIS TO A DIFF BACKEND IF NEEDED
    var provider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(provider)
      .then((result) => {
        setCurrentUser(result.user);
        history.push("/");
        console.log(result);
        //var credential = result.credential;
        // This gives you a Google Access Token. You can use it to access the Google API.
        //var token = credential.accessToken;
        // The signed-in user info.
        //var user = result.user;
        // ...
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //Reset password function
  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  //Update email function
  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  //Update password function
  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }
  */

  //Logout function
  function logout() {
    return auth.signOut();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      //setCurrentUser(user);
      //setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    //login,
    //signUp,
    logout,
    //resetPassword,
    //updateEmail,
    //updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
