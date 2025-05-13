import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v2/user/login",
        {
          email: emailOrUsername.includes("@") ? emailOrUsername : undefined,
          username: !emailOrUsername.includes("@")
            ? emailOrUsername
            : undefined,
          password,
        },
        {
          withCredentials: true,
        }
      );

      const { accessToken, refreshToken, user } = response.data.data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        setSuccessMessage("Login successful!");
        setIsAuthenticated(true); // This should trigger a re-render in App

        // Redirect to CreateTodo after successful login
        navigate("/CreateTodo");
      } else {
        throw new Error("Access token is missing.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {successMessage && (
        <div className="text-green-500 text-center mb-4">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">
            Email or Username
          </label>
          <input
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter email or username"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
