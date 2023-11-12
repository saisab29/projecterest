
import Home from "./Components/Home/Home";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Auth from "./Components/Auth/Auth";
import { auth } from "./firebase";



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const listener = auth.onAuthStateChanged(user => {
      console.log(user)
    })

    return () => listener();
  }, [])
  return (
    <div className="App">
      <Router>
        <Routes>

          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth signup />} />
          <Route path="/account" element={<h1>Login</h1>} />
          <Route path="/" element={<Home />} />


        </Routes>
      </Router>



    </div >
  );
}

export default App;
