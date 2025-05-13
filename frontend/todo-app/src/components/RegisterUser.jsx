import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterUser = ({ setIsAuthenticated }) => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleFileChange = (e, type) => {
    if (type === "avatar") {
      setAvatar(e.target.files[0]);
    } else if (type === "coverImage") {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v2/user/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (
        response.status === 200 &&
        response.data.message === "user registered successfully"
      ) {
        setSuccessMessage("User registered successfully!");
        setError("");

        // Simulate login / token storage (adjust this based on backend response)
        localStorage.setItem("token", "dummy_token"); // Use real token if provided
        setIsAuthenticated(true);

        navigate("/CreateTodo"); // redirect to todo page
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Registration failed.";
      setError(errMsg);
      setSuccessMessage("");

      if (errMsg === "User Already exists") {
        navigate("/login");
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Register User</h2>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {successMessage && (
        <div className="text-green-500 text-center mb-4">{successMessage}</div>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <div>
          <label htmlFor="fullName" className="block text-gray-700 font-medium">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter full name"
            required
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-gray-700 font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter username"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter email"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter password"
            required
          />
        </div>
        <div>
          <label htmlFor="avatar" className="block text-gray-700 font-medium">
            Avatar
          </label>
          <input
            type="file"
            id="avatar"
            onChange={(e) => handleFileChange(e, "avatar")}
            className="w-full p-3 border border-gray-300 rounded-md"
            accept="image/*"
            required
          />
        </div>
        <div>
          <label
            htmlFor="coverImage"
            className="block text-gray-700 font-medium"
          >
            Cover Image (Optional)
          </label>
          <input
            type="file"
            id="coverImage"
            onChange={(e) => handleFileChange(e, "coverImage")}
            className="w-full p-3 border border-gray-300 rounded-md"
            accept="image/*"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterUser;
