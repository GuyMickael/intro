import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import BackToHomeButton from "../components/BackToHomeButton/BackToHomeButton";

export default function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const token = localStorage.getItem("refreshToken");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <Outlet />
      {!isHome && <BackToHomeButton />}
    </>
  );
}
