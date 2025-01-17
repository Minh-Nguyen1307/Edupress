import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


const SECRET_KEY = import.meta.env.VITE_SECRET_KEY; 


const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};

const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const signInUser = async (email, password, rememberMe, navigate, setErrorLogIn) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/users/signInUser`,
      { email, password }
    );

    if (response.data.token) {
      const { token, user } = response.data;

   
      if (rememberMe) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", JSON.stringify(user));
        localStorage.setItem("email", email);  
        localStorage.setItem("password", encryptPassword(password)); 
      } else {
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("userId", JSON.stringify(user));
        sessionStorage.setItem("email", email);  
        sessionStorage.setItem("password", encryptPassword(password)); 
      }

      const userId = user.userId;

      user.role === "admin" 
        ? navigate("/admin-dashboard/home") 
        : window.location.href = `/${userId}`;
    } else {
      setErrorLogIn("Invalid credentials. Please try again.");
    }
  } catch (error) {
    setErrorLogIn(
      error.response?.data?.message || "Something went wrong. Please try again."
    );
  }
};

export default function SignInPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorLogIn, setErrorLogIn] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const storedEmail = localStorage.getItem("email") || sessionStorage.getItem("email");
    const storedEncryptedPassword = localStorage.getItem("password") || sessionStorage.getItem("password");

    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }));

      if (storedEncryptedPassword) {
        
        const decryptedPassword = decryptPassword(storedEncryptedPassword);
        setFormData((prev) => ({ ...prev, password: decryptedPassword }));
      }

      setRememberMe(!!localStorage.getItem("email")); 
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setErrorLogIn("");
    setLoading(true);
    try {
      await signInUser(formData.email, formData.password, rememberMe, navigate, setErrorLogIn);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const timeToExpire = (decoded.exp * 1000) - Date.now();

        const logoutTimeout = setTimeout(() => {
          alert("Session expired, please sign in again.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("user");
          navigate("/signin");
        }, timeToExpire);

        return () => clearTimeout(logoutTimeout);
      } catch (error) {
        console.error("Error decoding token:", error);
        alert("Invalid session, please sign in again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("user");
        navigate("/signin");
      }
    }
  }, [navigate]);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="max-w-screen-sm border-2 rounded-2xl my-10">
        <div className="text-4xl font-semibold text-gray-800 my-14 text-center">
          Log In
        </div>
        <form onSubmit={handleForm} className="d-flex flex-col justify-around p-6">
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

          {errorLogIn && <div className="text-red-500 mb-4">{errorLogIn}</div>}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className="mr-2 w-fit"
            />
            <label htmlFor="rememberMe" className="text-gray-600 text-lg ">Remember me</label>
          </div>

          <button className="bg-orange-500 text-xl text-white font-semibold p-2 my-5 rounded-2xl hover:bg-orange-600" disabled={loading}>
            Log In
          </button>
        </form>
        <div className="mb-10 w-full flex justify-center items-center flex-col">
          <div className="flex justify-center text-blue-500 mb-5">Forgot Password?</div>
          <Link to="/signin" className="flex justify-center">
            <button className="bg-gray-200 rounded-2xl w-1/2 flex justify-center items-center hover:bg-gray-500">
              <span className="text-lg font-medium hover:text-red-800 w-fit mr-3 p-2">
                Log In with 
              </span>
              <img src="1.png" alt="Signup with" className="w-24" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
