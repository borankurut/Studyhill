import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function SignUp() {
  const [emailText, setEmailText] = useState("");
  const [usernameText, setusernameText] = useState("");
  const [passText, setPassText] = useState("");
  const [passConfirmText, setPassConfirmText] = useState("");
  const [isEmailTextValid, setIsEmailTextValid] = useState(false);

  // user object to send to backend.
  var user = {
    username: usernameText,
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
  const handleSignUp = (e) => {
    e.preventDefault();

    // If email is not valid, then alert user and quit the function
    if (!isEmailTextValid) {
      alert("Invalid Email!");
      return;
    }

    if (passText !== passConfirmText) {
      alert("Passwords are not matching!");
      return;
    }

    // Post user and navigate to login page.
    axios
      .post("/signup", user) // post user to backend
      .then((res) => {
        // Navigate to login page
        navigate("/login");
      })
      // If there is an error occour during communication
      // Print it to console.
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mx-auto h-screen w-screen flex flex-col items-center justify-center">
      <div className="text-center bg-navbar-dark p-16 md:p-24 shadow-md shadow-navbar-dark rounded-md">
        <h1 className="font-sans font-semibold text-xl md:text-2xl lg:text-3xl xl:text-4xl tracking-widest mb-8">
          STUDYHILL SIGN UP
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
            name="username"
            type="text"
            required
            placeholder="Please enter your user name"
            className="text-black w-full p-2 outline-navbar-dark text-base md:text-lg lg:text-xl xl:text-2xl rounded-sm"
            onChange={(e) => {
              setusernameText(e.target.value);
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
          <input
            name="password-confirm"
            type="password"
            required
            placeholder="Please confirm your password"
            className="text-black w-full p-2 outline-navbar-dark text-base md:text-lg lg:text-xl xl:text-2xl rounded-sm"
            onChange={(e) => {
              setPassConfirmText(e.target.value);
            }}
          />
          <button
            type="submit"
            className="text-navbar-dark bg-white py-4 px-6 font-bold text-base md:text-lg lg:text-xl xl:text-2xl rounded-md hover:bg-slate-200 transition duration-150 ease-in"
            onClick={handleSignUp}
            disabled={
              emailText === "" ||
              usernameText === "" ||
              passText === "" ||
              passConfirmText === ""
            }
          >
            SIGN UP
          </button>
        </form>

        <Link
          to="/login"
          className="font-semibold underline text-sm md:text-base lg:text-lg xl:text-xl m-6 hover:text-slate-200 transition duration-150 ease-in inline-block"
        >
          Already have an account?
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
