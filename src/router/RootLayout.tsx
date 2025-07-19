import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function RootLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("refreshToken");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <Outlet />
    </>
  );
}
