import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/authetication/Login";
import Signup from "./components/authetication/Signup";
import OTPPage from "./components/authetication/Otp";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./route/PrivateRoute";
import Homepage from "./components/common/Homepage";
import { useEffect, useState } from "react";

function App() {
  const [user,setUser]=useState('')
  useEffect(()=>{
    const userData=localStorage.getItem('userAuth')
    if(userData){
      setUser(userData)
    }

  },[])
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={user? <Navigate to="/" />  : <Login />} />
        <Route path="/signup" element={user? <Navigate to="/" />  :<Signup />} />
        <Route path="/otp-page" element={user? <Navigate to="/" />  :<OTPPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Homepage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
