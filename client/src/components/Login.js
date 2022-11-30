import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [emailText, setEmailText] = useState("");
  const [passText, setPassText] = useState("");

  var user = {
    email: emailText,
    password: passText,
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("/login", user)
      .then((res) => {
        if (res.data.verification == true) navigate("/profile-user");
        else alert("Your email or password is incorrect");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mx-auto h-screen w-screen flex flex-col items-center justify-center">
      <div className="text-center bg-navbar-dark p-16 md:p-24 shadow-md shadow-navbar-dark">
        <h1 className="font-sans font-semibold text-xl md:text-2xl lg:text-3xl xl:text-4xl tracking-widest mb-8">
          STUDYHILL LOGIN
        </h1>
        <form className="flex flex-col items-center justify-center gap-4 w-full py-6 border-b-2">
          <input
            name="email"
            type="email"
            required
            placeholder="Please enter your email"
            className="text-black w-full p-2 outline-navbar-dark text-sm md:text-base lg:text-lg xl:text-xl rounded-sm"
            onChange={(e) => {
              setEmailText(e.target.value);
            }}
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Please enter your password"
            className="text-black w-full p-2 outline-navbar-dark text-sm md:text-base lg:text-lg xl:text-xl rounded-sm"
            onChange={(e) => {
              setPassText(e.target.value);
            }}
          />
          <button
            onClick={handleSubmit}
            className="text-navbar-dark bg-white py-4 px-6 font-bold text-base md:text-lg lg:text-xl xl:text-2xl rounded-md hover:bg-slate-200 transition duration-150 ease-in"
          >
            LOGIN
          </button>
        </form>

        <button className="font-semibold underline text-sm md:text-base lg:text-lg xl:text-xl m-6 hover:text-slate-200 transition duration-150 ease-in inline-block">
          Forgotten Password?
        </button>
        <br />
        <Link
          to="/sign-up"
          className="bg-white text-navbar-dark p-4 transition duration-150 ease-in rounded-lg hover:bg-slate-200 font-semibold text-sm md:text-base lg:text-lg xl:text-xl inline-block"
        >
          Create New Account
        </Link>
      </div>
    </div>
  );
}

export default Login;
