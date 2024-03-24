import {createBrowserRouter} from "react-router-dom";
import {LoginSafeRoute} from "./components.tsx";
import DashBoardView from "../views/DashBoardView.tsx";
import AuthView from "../views/AuthView.tsx";

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
    path: '/auth',
    element: <AuthView />
  }
])

export default router
