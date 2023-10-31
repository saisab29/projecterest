
import Home from "./Components/Home/Home";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"



function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

          <Route path="/login" element={<h1>Login</h1>} />
          <Route path="/signup" element={<h1>Signup</h1>} />
          <Route path="/account" element={<h1>Login</h1>} />
          <Route path="/" element={<Home />} />


        </Routes>
      </Router>



    </div >
  );
}

export default App;
