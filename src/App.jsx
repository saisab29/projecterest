
import Home from "./Components/Home/Home";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Auth from "./Components/Auth/Auth";
import { auth, getUserFromDatabase } from "./firebase";



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({});


  const fetchUserDetails = async (uid) => {
    const userDetails = await getUserFromDatabase(uid);
    setUserDetails(userDetails);
  }
  useEffect(() => {
    const listener = auth.onAuthStateChanged(user => {
      if (!user) return;

      setIsAuthenticated(true);
      fetchUserDetails(user.uid)
      console.log(userDetails)
    })

    return () => listener();
  }, [])
  return (
    <div className="App">
      <Router>
        <Routes>
          {!isAuthenticated && (<>


            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth signup />} />
          </>

          )}

          <Route path="/account" element={<h1>Login</h1>} />
          <Route path="/" element={<Home auth={isAuthenticated} />} />
          <Route path="/*" element={<Navigate to="/" />} />


        </Routes>
      </Router>



    </div >
  );
}

export default App;
