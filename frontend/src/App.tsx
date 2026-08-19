import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Kanban from "./pages/Kanban";
import TaskDetails from "./pages/TaskDetails";
import AI from "./pages/AI";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Teams from "./pages/Teams";
import TeamDetails from "./pages/TeamDetails";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* KANBAN */}

        <Route
          path="/kanban"
          element={
            <ProtectedRoute>
              <Kanban />
            </ProtectedRoute>
          }
        />

        {/* TASK DETAILS */}

        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute>
              <TaskDetails />
            </ProtectedRoute>
          }
        />

        {/* PROJECTS */}

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />

        {/* TEAMS */}

        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams/:id"
          element={
            <ProtectedRoute>
              <TeamDetails />
            </ProtectedRoute>
          }
        />

        {/* AI */}

        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <AI />
            </ProtectedRoute>
          }
        />

        {/* SETTINGS */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* PROFILE */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* NOTIFICATIONS */}

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* 404 */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;