import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import "./login.css"; 

function Login() {
  const [error, setError] = useState("");
  //const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;


    if (username === "admin" && password === "admin") {
      setError("");
        window.location.href = "/dashboard/maindashboardlayout"; // Redirect to dashboard page on successful login
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div>
      
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 mb-4 mb-md-0">
            {/* <h2>Welcome to GE Healthcare Portal</h2> */}
            <p className="text-start">
              GEHC CT Program is developing upgrades to CT scanners in use around the globe. The center is currently focusing on continued enhancement of a next generation of CT machine and its necessary workflows and applications. Gen/AI usecases in this segment
              <br />
              <br />
              <b>UseCase# 1 </b>- Pre-Install Manual
              <br />
              <b>UseCase# 2 </b>- PSDB - Problem Solution Database
              <br />
              <b>UseCase# 3 </b>-  AI correction report that identifies at least 95% of errors, utilising  a cloud-based API.
            </p>
          </div>
          <div className="col-md-6 d-flex align-items-center">
            <form id="loginForm" className="mx-auto w-100 text-start" style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
              <h2 className="mb-4 text-start">Login</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="form-control"
                />
              </div>
              <button
                type="submit"
                className="btn w-100"
                style={{ backgroundColor: "#4C3494", color: "white" }}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;