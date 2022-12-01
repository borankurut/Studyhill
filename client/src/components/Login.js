import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

function Login() {
  const [emailText, setEmailText] = useState("");
  const [passText, setPassText] = useState("");
  const [isEmailTextValid, setIsEmailTextValid] = useState(false);

  const [data, setData] = useState(null);

  var user = {
    email: emailText,
    password: passText,
  };

  useEffect(() => {
    if (
      String(emailText)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    )
      setIsEmailTextValid(true);
    else setIsEmailTextValid(false);
  }, [emailText]);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isEmailTextValid) {
      alert("Invalid Email!");
      return;
    }

    axios
      .post("/login", user)
      .then((res) => {
        if (res.data.verification) {
          // store username and device ID to local storage to make next
          // loggin automatically.
          localStorage.setItem("username", res.data.username);
          localStorage.setItem("studyhill-device-id", res.data.uniqeDeviceID);

          // Navigate to profile page
          setData(res.data);
          console.log(data);
          if (res.data.hasGroup) navigate("/profile-group");
          else navigate("/profile-user");
        } else alert("Your email or password is incorrect");
      })
      .catch((err) => console.log(err));
  };

  // Check that whether user is already loggin or not
  if (
    localStorage.getItem("username") !== null &&
    localStorage.getItem("studyhill-device-id") !== null
  ) {
    axios
      .post("/check-already-login", {
        username: localStorage.getItem("username"),
        uniqeDeviceID: localStorage.getItem("studyhill-device-id"),
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.verification) {
          // User already loggin
          if (res.data.hasGroup) navigate("/profile-group");
          else navigate("/profile-user");
        }
      })
      .catch((err) => console.log(err));
  }

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
            disabled={emailText === "" || passText === ""}
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
