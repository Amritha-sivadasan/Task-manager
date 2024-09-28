import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const userAuth= localStorage.getItem("userAuth");
  
  return userAuth ? <Outlet/> : <Navigate to="/login" replace />;
};

export default PrivateRoute