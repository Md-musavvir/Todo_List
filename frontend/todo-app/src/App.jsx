import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import CreateTodo from "./components/CreateTodo";
import RegisterUser from "./components/RegisterUser";
import Login from "./components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // Get the token from localStorage
    if (token) {
      setIsAuthenticated(true); // Set authentication status if token exists
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/CreateTodo" />
            ) : (
              <RegisterUser setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/CreateTodo" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/CreateTodo"
          element={isAuthenticated ? <CreateTodo /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
