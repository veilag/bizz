import {createBrowserRouter} from "react-router-dom";
import {LoginSafeRoute} from "./components.tsx";
import DashBoardView from "../views/DashBoardView.tsx";
import LoginView from "@/views/LoginView.tsx";
import SignUpView from "@/views/SignUpView.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LoginSafeRoute>
        <DashBoardView />
      </LoginSafeRoute>
    )
  },
  {
    path: '/login',
    element: <LoginView />
  },
  {
    path: '/signup',
    element: <SignUpView />
  }
])

export default router
