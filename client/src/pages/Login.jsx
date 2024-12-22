import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "../Styles/Login.css";
import { useDispatch } from "react-redux";
import { login } from "../actions/userAction.js"; // Adjust the import path as needed
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
    navigate("/form")
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <div className="input-icon">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-icon">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="btns">
            <input type="submit" value="Submit" />
            <input type="reset" value="Clear Form" onClick={() => {
              setEmail("");
              setPassword("");
            }} />
          </div>
        </div>
      </form>
    </div>
  );
}
