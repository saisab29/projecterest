
import Home from "./Components/Home/Home";
import Loader from "./Components/Loader/Loader";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Auth from "./Components/Auth/Auth";
import { auth, getUserFromDatabase } from "./firebase";
import "./App.css";
import Account from "./Components/Account/Account";




function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);


  const fetchUserDetails = async (uid) => {
    const userDetails = await getUserFromDatabase(uid);
    setIsDataLoaded(true);
    setUserDetails(userDetails);
  }
  useEffect(() => {
    const listener = auth.onAuthStateChanged(user => {
      if (!user) {
        setIsDataLoaded(true);
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      fetchUserDetails(user.uid)
      console.log(userDetails)
    })

    return () => listener();
  }, [])


  return (
    <div className="App">
      <Router>
        {isDataLoaded ?

          (<Routes>
            {!isAuthenticated && (<>


              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth signup />} />
            </>

            )}

            <Route path="/account" element={<Account userDetails={userDetails} auth={isAuthenticated} />} />
            <Route path="/" element={<Home auth={isAuthenticated} />} />
            <Route path="/*" element={<Navigate to="/" />} />


          </Routes>
          ) : (<div className="loader"><Loader /></div>)

        }
      </Router>



    </div >
  );
}

export default App;
