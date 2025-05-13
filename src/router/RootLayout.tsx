import { Outlet, useLocation } from "react-router-dom";
import BackToHomeButton from "../components/BackToHomeButton/BackToHomeButton";
import Header from "../components/Header/Header";

export default function RootLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <Outlet />
      {!isHome && <BackToHomeButton />}
    </>
  );
}
