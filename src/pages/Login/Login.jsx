import React, { useState } from 'react';
import './Login.css';
import assets from '../../assets/assets';
import { signup, login, resetPass } from "../../config/firebase";
import { useNavigate } from 'react-router-dom'; // ✅ Import navigate

const Login = () => {
  const [currState, setCurrState] = useState('Sign up');
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ Setup navigate

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currState === "Sign up") {
        await signup(userName, email, password); // ✅ Await signup
      } else {
        await login(email, password); // ✅ Await login
      }
      navigate("/chat"); // ✅ Redirect after success
    } catch (error) {
      console.error("Auth Error:", error.message);
      alert(error.message); // ✅ Optional error alert
    }
  };

  return (
    <div className='login'>
      <img src={assets.logo_big} alt="Logo" className="logo" />
      <form
        key={currState}
        onSubmit={onSubmitHandler}
        className={`login-form ${currState === 'Login' ? 'login-mode' : 'signup-mode'}`}
      >
        <h2>{currState}</h2>

        {currState === "Sign up" && (
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            type="text"
            className="form_input"
            placeholder="Username"
            required
          />
        )}

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="form_input"
          placeholder="Email address"
          required
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="form_input"
          placeholder="Password"
          required
        />

        <button type="submit">
          {currState === "Sign up" ? "Create account" : "Login now"}
        </button>

        <div className="login-term">
          <input type="checkbox" required />
          <p>Agree to the terms of use and privacy policy.</p>
        </div>

        <div className="login-forgot">
          {currState === "Sign up" ? (
            <p className="login-toggle">
              Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span>
            </p>
          ) : (
            <p className="login-toggle">
              Create an account. <span onClick={() => setCurrState("Sign up")}>Click here</span>
            </p>
          )}

          {currState === "Login" && (
            <p className="login-toggle">
              Forgot Password? <span onClick={() => resetPass(email)}>Reset here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
