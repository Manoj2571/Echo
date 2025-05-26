import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  signupUserAsync } from "../features/users/usersSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
        fullName: null,
        userName: null,
        email: null
    })

  const [password, setPassword] = useState({
    key: "",
    confirmKey: "",
    isSecure: false,
  });

  const [loading, setLoading] = useState(false)
  

  const handlePasswordChange = (pass) => {
    if (
      /[a-z]/.test(pass) &&
      /[A-Z]/.test(pass) &&
      /[^A-Za-z0-9]/.test(pass) &&
      /\d/.test(pass) &&
      pass.length >= 8
    ) {
      setPassword({ ...password, key: pass, isSecure: true });
    } else {
      setPassword({ ...password, key: pass, isSecure: false });
    }
  };

  const confirmPasswordHandler = (e) => {
    setPassword({...password, confirmKey: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUserData = {...newUser, password: password.key}
    setLoading(true)

    if(password.isSecure) {
      try {
      await dispatch(signupUserAsync(newUserData)).unwrap();
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
    } else {
        setLoading(false)
        if(!(/[a-z]/.test(password.key))) {toast.error("Password must include at least one lowercase letter.")}
            if(!(/[A-Z]/.test(password.key))) {toast.error("Password must include at least one uppercase letter.")}
            if(!(/[^A-Za-z0-9]/).test(password.key)) {toast.error("Password must include at least one special character (e.g. !@#$%^&*).")}
            if(!(/\d/.test(password.key))) {toast.error("Password must include at least one number.")}
            if(password.key.length < 8) {toast.error("Password must be at least 8 characters long.")}

    }

  };

  return (
      <div className="container d-flex flex-column align-items-center h-full w-full mb-3">
        <div className="my-3">
          <Link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="70"
              height="70"
              // fill="#FFF"
              // stroke="#FFF"
              viewBox="0 0 64 64"
            >
              <g id="SVGRepo_iconCarrier">
                <path
                  id="ap"
                  d="m10.73 38.65 11.82 6.94c.49.29.93.65 1.32 1.07l6.71 7.36c.38.42.9.63 1.42.62.46 0 .92-.16 1.28-.49.03-.02.11-.11.14-.13l6.71-7.36c.38-.42.83-.78 1.32-1.07l11.82-6.94a3.44 3.44 0 0 0 1.58-2.11l5.11-20.7c.21-.85-.31-1.72-1.16-1.93a1.8 1.8 0 0 0-.8 0l-13.98 3.82-4.03-7.6c-.18-.34-.49-.6-.86-.71s-.77-.08-1.11.11c-.31.17-.55.44-.68.77l-1.62 4.2h-7.41l-1.62-4.2c-.14-.36-.41-.65-.77-.81a1.45 1.45 0 0 0-1.88.65l-4.03 7.6-13.98-3.82c-.41-.11-.84-.06-1.21.15s-.64.55-.75.97c-.07.26-.07.53 0 .8l5.11 20.7c.22.88.79 1.65 1.58 2.11Zm1.01-1.73s-.01-.02-.02-.03l8.18-14.83 2.77 21.27-10.93-6.42ZM31.99 52.6l-6.65-7.3c-.13-.14-.31-.23-.45-.36l-3.1-23.82 8.79 6.54c.83.62 1.99.62 2.81 0l8.8-6.54-3.1 23.82c-.14.13-.32.22-.45.37zm-2.96-36.11h5.92l-2.96 8.07zm12.28 26.85 2.77-21.27 8.18 14.83s-.01.02-.02.03l-10.93 6.42Zm11.95-8.79-8.28-15.01 12.86-3.51-4.57 18.53ZM38.75 12.11l3.45 6.5-8.12 6.04c4.05-11.05 2.73-7.52 4.67-12.54Zm-13.53 0 4.67 12.55-8.12-6.04zm-6.23 7.43-8.28 15.01-4.56-18.52 12.86 3.51Z"
                ></path>
              </g>
            </svg>
          </Link>
        </div>
        <div
          className=" bg-white br-m py-4 p-xxl"
          style={{ width: "30rem" }}
        >
          <h2 className="text-center fw-bold  mt-2">Signup</h2>
          <form className="pt-3" onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              className="form-control mb-3 p-xs"
              type="text"
              onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
              placeholder="John Doe"
              value={newUser.fullName}
              required
            />
            <label>Username</label>
            <input
              className="form-control p-xs"
              type="text"
              value={newUser.userName}
              placeholder="Atleast 4 characters"
              onChange={(e) => setNewUser({...newUser, userName: e.target.value})}
              required
            />
            <label className="mt-3">Email Address</label>
            <input
              className="form-control p-xs"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              placeholder="john.doe@example.com"
              required
            />
            <label className="mt-3">Password</label>
            <input
              className="form-control p-xs"
              type="password"
              value={password.key}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="**********"
              required
            />
            <label className="mt-3">Confirm Password</label>
            <input
              className="form-control"
              type="password"
              value={password.confirmKey}
              onChange={confirmPasswordHandler}
              placeholder="**********"
              required
            />
            {password.confirmKey && password.confirmKey !== password.key && (
              <>
                <small className="primary-txt mt-0">
                  Passwords didn't match.
                </small>
                <br />
              </>
            )}
            <label className="my-4">
              <input type="checkbox" required /> I accept all Terms & Conditions
            </label>
            <button className="primary-bg py-2 w-100 border-0 outline-transparent text-white" disabled={loading}>
              Create New Account
            </button>
            <p className="mt-3 mb-0 text-center">
        Already have an account?{" "}
        <Link to="/login" className="primary-txt fw-semibold text-decoration-none">
          Sign In
        </Link>
      </p>
          </form>
        </div>
      </div>
  );
};

export default Signup;
