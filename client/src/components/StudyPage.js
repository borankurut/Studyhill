import { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

function StudyPage() {
  const [timerStarted, setTimerStarted] = useState(false);
  const [breakTimerStarted, setBreakTimerStarted] = useState(false);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [timeToSubmit, setTimeToSubmit] = useState(0);
  const [studyTime, setStudyTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [startButtonText, setStartButtonText] = useState("start");
  const [breakButtonText, setBreakButtonText] = useState("break");
  const [username, setUsername] = useState("foo");
  const [bgImage, setBgImage] = useState(() => {
    if (localStorage.getItem("studypage-bg-image"))
      return "bg-" + localStorage.getItem("studypage-bg-image");
    else return "bg-mountain-1";
  });

  const navigate = useNavigate();

  const startTimerButtonRef = useRef();
  const breakTimerButtonRef = useRef();
  const settingDiv = useRef();

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
          // Check user logged in or not
          if (!res.data.verification) {
            // User is not loggin
            // Warn user and navigate to the loggin page
            alert("User is not loggin!!!");
            navigate("/login");
          } else {
            // If user already login then get the username
            // to send time studied to correct user
            setUsername(res.data.username);
          }
        })
        // Catch and print error to the console if an error happends during
        // communication with backend server
        .catch((err) => console.log(err));
    }
  }, []);

  // Submit studied time
  useEffect(() => {
    axios
      .post("/time", { username: username, timeStudied: timeToSubmit })
      .catch((err) => console.log(err));
  }, [timeToSubmit]);

  // TODO
  const startStudyTimer = () => {
    console.log("startTimer");
  };

  // TODO
  const stopStudyTimer = () => {
    console.log("stopTimer");
  };

  const startBreakTimer = () => {
    console.log("startBreakTimer");
  };

  const stopBreakTimer = () => {
    console.log("stopBreakTimer");
  };

  const handleStartButton = () => {
    if (breakTimerStarted) {
      alert("Break time is still running!");
    } else {
      if (timerStarted) {
        stopStudyTimer();
        setStartButtonText("start");
        setTimerStarted(false);
      } else {
        startStudyTimer();
        setStartButtonText("stop");
        setTimerStarted(true);
      }
    }
  };

  const handleBreakButton = (e) => {
    if (timerStarted) {
      alert("Study timer is still running");
    } else {
      if (breakTimerStarted) {
        setBreakButtonText("break");
        setBreakTimerStarted(false);
      } else {
        setBreakButtonText("stop");
        setBreakTimerStarted(true);
      }
    }
  };

  const handleClickSettings = (e) => {
    e.preventDefault();

    // If timer is running do not open the settings menu
    if (timerStarted || breakTimerStarted) {
      alert("You can't open settings while timer is still running");
    } else {
      // Open the settings menu
      settingDiv.current.classList.remove("invisible", "opacity-0");
    }
  };

  const handleEndButton = (e) => {
    e.preventDefault();
    if (timerStarted || breakTimerStarted) {
      alert("You cannot end study session while timer is still running");
    } else {
      navigate("/profile-user");
    }
  };

  return (
    <div
      className={`relative m-0 p-0 w-full h-screen flex flex-col items-center justify-center ${bgImage} bg-fixed bg-bottom bg-no-repeat bg-cover`}
    >
      {/* Centered Div */}
      <div className="flex flex-col items-center justify-center gap-6 rounded-lg bg-black w-96 md:w-auto opacity-75 p-24">
        {/* Timer */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold font-sans tracking-wide ">
          {studyTime}:00
        </h1>
        {/* Buttons */}
        <div className="flex gap-1 md:gap-8">
          <button
            value={startButtonText}
            ref={startTimerButtonRef}
            onClick={handleStartButton}
            className="text-sm md:text-base lg:text-lg xl:text-xl font-sans font-semibold border-2 bg-transparent hover:bg-white text-white hover:text-slate-900 px-4 py-2 rounded-lg transition duration-150 ease-in"
          >
            {startButtonText}
          </button>
          <button
            value={breakButtonText}
            ref={breakTimerButtonRef}
            onClick={handleBreakButton}
            className="text-sm md:text-base lg:text-lg xl:text-xl font-sans font-semibold border-2 bg-transparent hover:bg-white text-white hover:text-slate-900 px-4 py-2 rounded-lg transition duration-150 ease-in"
          >
            {breakButtonText}
          </button>
          <button
            onClick={handleEndButton}
            className="text-sm md:text-base lg:text-lg xl:text-xl font-sans font-semibold border-2 bg-transparent hover:bg-white text-white hover:text-slate-900 px-4 py-2 rounded-lg transition duration-150 ease-in"
          >
            end
          </button>
          <button onClick={handleClickSettings}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-12 h-12 border-2 bg-transparent hover:bg-white text-white hover:text-slate-900 rounded-lg transition duration-150 ease-in"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Studyhill footer logo */}
      <h1 className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm md:text-base lg:text-lg xl:text-xl font-bold tracking-widest text-white">
        STUDYHILL
      </h1>

      {/* Settings pop up menu */}
      <div
        ref={settingDiv}
        className="invisible opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 max-h-full p-6 -translate-y-1/2 w-96 md:w-1/2 bg-black text-white rounded-lg flex flex-col items-start gap-6"
      >
        {/* Study timer */}
        <div>
          <label className="font-sans font-semibold text-sm md:text-base lg:text-lg xl:text-xl">
            Study Timer
          </label>
          <input
            type="number"
            value={studyTime}
            onChange={(e) => {
              setStudyTime(e.target.value);
            }}
            min="10"
            max="60"
            className="w-24 text-black font-sans font-semibold text-sm md:text-base lg:text-lg xl:text-xl px-2 py-1 ml-4 rounded-lg"
          />
        </div>
        {/* Break Timer */}
        <div>
          <label className="font-sans font-semibold text-sm md:text-base lg:text-lg xl:text-xl">
            Break Timer
          </label>
          <input
            type="number"
            value={breakTime}
            onChange={(e) => {
              setBreakTime(e.target.value);
            }}
            min="10"
            max="60"
            className="w-24 text-black font-sans font-semibold text-sm md:text-base lg:text-lg xl:text-xl px-2 py-1 ml-4 rounded-lg"
          />
        </div>
        {/* Change Background image */}
        <div className="w-full rounded-lg">
          <h1 className="font-semibold font-sans text-sm md:text-base lg:text-lg xl:text-xl text-white tracking-wider py-4 my-4 border-b-2 border-b-white">
            Change Background Image
          </h1>
          {/* image container div */}
          <div className="overflow-x-scroll w-full h-full rounded-lg flex items-center gap-1">
            <img
              className="w-48 rounded-lg cursor-pointer"
              src="./img/mountain_agri.jpg"
              alt="mountain agri"
              onClick={() => {
                localStorage.setItem("studypage-bg-image", "mountain-1");
                setBgImage("bg-mountain-1");
              }}
            />
            <img
              className="w-48 rounded-lg cursor-pointer"
              src="./img/mountain_mckinley.jpg"
              alt="mountain mckinley"
              onClick={() => {
                localStorage.setItem("studypage-bg-image", "mountain-2");
                setBgImage("bg-mountain-2");
              }}
            />
            <img
              className="w-48 rounded-lg cursor-pointer"
              src="./img/parth-savani-uCuZ9kscyuc-unsplash.jpg"
              alt="mountain savani "
              onClick={() => {
                localStorage.setItem("studypage-bg-image", "mountain-3");
                setBgImage("bg-mountain-3");
              }}
            />
            <img
              className="w-48 rounded-lg cursor-pointer"
              src="./img/stephan-bechert-xQWelDCacZE-unsplash.jpg"
              alt="a mountain from africa"
              onClick={() => {
                localStorage.setItem("studypage-bg-image", "mountain-4");
                setBgImage("bg-mountain-4");
              }}
            />
            <img
              className="w-48 rounded-lg cursor-pointer"
              src="./img/toan-chu-pKFCH2t00wA-unsplash.jpg"
              alt="a mountain from japan"
              onClick={() => {
                localStorage.setItem("studypage-bg-image", "mountain-5");
                setBgImage("bg-mountain-5");
              }}
            />
            <img
              className="w-48 rounded-lg cursor-pointer"
              src="./img/tomas-malik-orQBzc7Dl3U-unsplash.jpg"
              alt="a mountain from japan"
              onClick={() => {
                localStorage.setItem("studypage-bg-image", "mountain-6");
                setBgImage("bg-mountain-6");
              }}
            />
          </div>
        </div>
        <button
          onClick={() => {
            settingDiv.current.classList.add("invisible", "opacity-0");
          }}
          className="p-4 bg-white text-black w-24 hover:bg-slate-300  font-semibold font-sans text-sm md:text-base lg:text-lg xl:text-xl rounded-lg self-center transition duration-150 ease-in"
        >
          close
        </button>
      </div>
    </div>
  );
}

export default StudyPage;
