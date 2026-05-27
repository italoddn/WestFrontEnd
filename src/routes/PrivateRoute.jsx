import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("tooken");

  useEffect(() => {
    if (!token) {
      toast.error("Faça login", {
        toastId: "login-error",
      });
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
