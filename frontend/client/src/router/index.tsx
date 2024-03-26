import {createBrowserRouter, Navigate} from "react-router-dom";
import {LoginSafeRoute} from "./components.tsx";
import DashBoardView from "../views/DashBoardView.tsx";
import LoginView from "@/views/LoginView.tsx";
import SignUpView from "@/views/SignUpView.tsx";
import BusinessDashboardView from "@/views/BusinessDashboardView.tsx";
import NotFound from "@/views/NotFound.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LoginSafeRoute>
        <DashBoardView />
      </LoginSafeRoute>
    ),
    children: [
      {
        path: '/list',
        element: <BusinessDashboardView />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginView />
  },
  {
    path: '/signup',
    element: <SignUpView />
  },
  {
    path: '/notfound',
    element: <NotFound />
  },
  {
    path: '*',
    element: <Navigate to="/notfound" />
  },
])

export default router
