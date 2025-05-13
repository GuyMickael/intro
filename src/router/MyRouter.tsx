import { createBrowserRouter, RouterProvider } from "react-router-dom";
import myRoutes from "./routes";

const router = createBrowserRouter(myRoutes);

const MyRouter = () => {
  return <RouterProvider router={router} />;
};

export default MyRouter;
