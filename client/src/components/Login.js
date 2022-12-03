import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

function Login() {
  // Email Address read from input box
  const [emailText, setEmailText] = useState("");
  // password read from input box
  const [passText, setPassText] = useState("");
  // Holds whether syntax of email valid or not.
  const [isEmailTextValid, setIsEmailTextValid] = useState(false);

  // user object to send to backend.
  var user = {
    email: emailText,
    password: passText,
  };

  // Each change on emailText check that whether email is valid or not. And sets isEmailTextValid.
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

  // Submit handler function, invokes when login button is clicked,
  const handleSubmit = (e) => {
    e.preventDefault(); // Do not submit anything.

    // If email is not valid, then alert user and quit the function
    if (!isEmailTextValid) {
      alert("Invalid Email!");
      return;
    }

    axios
      .post("/login", user) // post user to backend
      .then((res) => {
        // if verification is true, first store user and device id to local storage
        if (res.data.verification) {
          //if email is not verified, alert and return login page
          if(!res.data.mailVerified){
            alert("Email is not verified.");
            navigate("/login");
            return;
          }
          // store username and device ID to local storage to make next
          // loggin automatically.
          localStorage.setItem("username", res.data.username);
          localStorage.setItem("studyhill-device-id", res.data.uniqeDeviceID);

          // Then Navigate to profile page

          // If user has group then navigate to group profile page
          // instead of user profile page
          if (res.data.hasGroup) navigate("/profile-group");
          else navigate("/profile-user"); // Else navigate to user profile page
        } else {
          // Case thatn account doesn't exists!
          // Warn user about it and stay in login page.
          alert("Your email or password is incorrect");
        }
      })
      // If there is an error occour during communication
      // Print it to console.
      .catch((err) => console.log(err));
  };

  // For the first load of the login page check
  // that user is already loggin or not.
  useEffect(() => {
    // Check that whether user is already loggin or not
    if (
      localStorage.getItem("username") !== null &&
      localStorage.getItem("studyhill-device-id") !== null
    ) {
      // If there is a username and device id for studyhill exist in
      // localstorage, then post backend to that information to check that
      // whether a user with the information send exists or not.
      // If exists navigate to the profile pages, respect to the information that
      // user has group or not, else keep proceed on loading login page.
      axios
        .post("/check-already-login", {
          // Send username and device id to backend server
          username: localStorage.getItem("username"),
          uniqeDeviceID: localStorage.getItem("studyhill-device-id"),
        })
        .then((res) => {
          // If user exists navigate user to profile page, with determining
          // which one to navigate
          if (res.data.verification) {
            // User has a group. Therefore navigate to group profile page
            if (res.data.hasGroup) navigate("/profile-group");
            // User hasn't got a group. Therefore navigate to user profile page.
            else navigate("/profile-user");
          }
        })
        // Catch and print error to the console if an error happends during
        // communication with backend server
        .catch((err) => console.log(err));
    }
  }, []);

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
            className="text-black w-full p-2 outline-navbar-dark text-base md:text-lg lg:text-xl xl:text-2xl rounded-sm"
            onChange={(e) => {
              setEmailText(e.target.value);
            }}
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Please enter your password"
            className="text-black w-full p-2 outline-navbar-dark text-base md:text-lg lg:text-xl xl:text-2xl rounded-sm"
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
