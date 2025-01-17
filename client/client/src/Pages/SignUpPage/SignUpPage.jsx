import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasSpecialChar && isLongEnough;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { userName, email, password, confirmPassword } = formData;

    if (!userName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must contain an uppercase letter, a lowercase letter, a special character, and be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/signUpUser`,
        { userName, email, password }
      );

      setSuccess(response.data.message);
      setFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      if (err.response?.data?.message === "Email already exists.") {
        setError("Email already exists. Please choose a different email.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to process your request. Please try again later."
        );
      }
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="max-w-screen-sm border-2 rounded-2xl my-10">
        <div className="text-4xl font-semibold text-gray-800 my-14 text-center">
          Register
        </div>
        <form onSubmit={handleSubmit} className="d-flex flex-col justify-around p-6">
          <div>
            <label className="text-gray-950 font-medium text-xl my-2">
              User Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="userName"
              placeholder="User Name"
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-2xl"
              required
            />
          </div>
          <div>
            <label className="text-gray-950 font-medium text-xl my-2">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-2xl"
              required
            />
          </div>
          <div className="relative">
            <label className="text-gray-950 font-medium text-xl my-2">
              Password <span className="text-red-600">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-2xl"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="w-fit absolute left-3/4 top-9 text-gray-500"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <div className="relative">
            <label className="text-gray-950 font-medium text-xl my-2">
              Confirm Password <span className="text-red-600">*</span>
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded-2xl"
              required
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="w-fit absolute left-3/4 top-9 text-gray-500"
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </button>
            
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}
          <button className="bg-orange-500 text-xl text-white font-semibold p-2 my-5 rounded-2xl hover:bg-orange-600">
            Register
          </button>
         
        </form>
        <div className=" mb-10 w-full flex justify-center items-center flex-col">
          <div className="flex justify-center">Already have an account?</div>
         
            <Link to="/signin" className="flex justify-center">
            <button className="bg-gray-200 rounded-2xl w-1/2 flex justify-center items-center hover:bg-gray-50">
              <span className="text-lg font-medium hover:text-red-800 w-fit mr-3 p-2">
                Log in with 
              </span>
              <img src="1.png" alt="Signup with" className="w-24" />
            </button>
          </Link>
          
        </div>
      </div>
      
      
    </div>
  );
}
