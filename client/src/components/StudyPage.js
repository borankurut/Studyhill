import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Countdown from "react-countdown";
import { useBeforeunload } from "react-beforeunload";
import axios from "axios";

function StudyPage() {
  // Checks whether study timer is started or not
  const [timerStarted, setTimerStarted] = useState(false);

  // Checks whether break timer is started or not
  const [breakTimerStarted, setBreakTimerStarted] = useState(false);

  // The time will been submit to the backend when it is setted.
  const [timeToSubmit, setTimeToSubmit] = useState(0);

  const [resetTimer, setResetTimer] = useState(1);

  // Study countdown in minutes
  const [studyCountdown, setStudyCountdown] = useState(() => {
    if (localStorage.getItem("studypage-study-countdown"))
      return parseInt(localStorage.getItem("studypage-study-countdown"));
    else return 25;
  });

  // Study clock displayed in page in format MM:SS
  const [studyTime, setStudyTime] = useState(
    Date.now() + studyCountdown * 60000
  );

  const [currentStudyTimerMin, setCurrentStudyTimerMin] =
    useState(studyCountdown);

  // Break countdown in minutes
  const [breakCountdown, setBreakCountdown] = useState(() => {
    if (localStorage.getItem("studypage-break-countdown"))
      return parseInt(localStorage.getItem("studypage-break-countdown"));
    else return 5;
  });

  // Break clock displayed in page in format MM:SS
  const [breakTime, setBreakTime] = useState(
    Date.now() + breakCountdown * 60000
  );

  // Text of start button. It can be eighter study or stop
  const [startButtonText, setStartButtonText] = useState("study");

  // Text of start button. It can be eighter break or stop
  const [breakButtonText, setBreakButtonText] = useState("break");

  // id of user. It needed during sending time studied to the backend
  const [id, setID] = useState("foo");

  // Background image
  const [bgImage, setBgImage] = useState(() => {
    if (localStorage.getItem("studypage-bg-image"))
      return localStorage.getItem("studypage-bg-image");
    else return "bg-mountain-1";
  });

  const navigate = useNavigate();

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
            // get id of user
            setID(res.data.id);
          }
        })
        // Catch and print error to the console if an error happends during
        // communication with backend server
        .catch((err) => console.log(err));
    } else {
      // User is not loggin
      // Navigate to login page
      navigate("/login");
    }
  }, []);

  // Submit studied time
  useEffect(() => {
    // Do not submit if time to submit is 0
    if (!timeToSubmit) return;
    // Else send
    let timeToSubmitInHours = timeToSubmit / 60;
    console.log(timeToSubmitInHours);
    axios
      .post("/addtime", { id: id, timeStudied: timeToSubmitInHours })
      .catch((err) => console.log(err));
  }, [timeToSubmit]);

  // Warn user if user try to close tab while timer is still running
  useBeforeunload((event) => {
    if (timerStarted || breakTimerStarted) {
      event.preventDefault();
    }
  });

  // Starts/Stops study timer if break timer is not running
  const handleStudyButton = () => {
    if (breakTimerStarted) {
      alert("Break time is still running!");
    } else {
      if (timerStarted) {
        setStartButtonText("start");
        setTimerStarted(false);
        studyClockRef.current.pause();
      } else {
        studyClockRef.current.start();
        setStartButtonText("stop");
        setTimerStarted(true);
      }
    }
  };

  // Starts/Stops break timer if study timer is not running
  const handleBreakButton = (e) => {
    if (timerStarted) {
      alert("Study timer is still running");
    } else {
      if (breakTimerStarted) {
        setBreakButtonText("break");
        setBreakTimerStarted(false);
        breakClockRef.current.pause();
      } else {
        setBreakButtonText("stop");
        setBreakTimerStarted(true);
        breakClockRef.current.start();
      }
    }
  };

  // Runs when study timer end
  const handleStudyTimeEnd = () => {
    // While changing time in settings
    // This function can invoke
    // To avoid this check that whether timer is
    // started or not
    // if running keep proceed, else exit from function.
    if (!timerStarted) return;

    // Change text
    setStartButtonText("start");
    // Set timerStarted false
    setTimerStarted(false);

    // Set study time for this set to send backend
    setTimeToSubmit(studyCountdown);

    // Alert user that time is over
    alert("Study time is over");

    setResetTimer((prev) => prev + 1);
  };

  // Runs when break timer end
  const handleBreakTimeEnd = () => {
    // While changing time in settings
    // This function can invoke
    // To avoid this check that whether timer is
    // started or not
    // if running keep proceed, else exit from function.
    if (!breakTimerStarted) return;

    // Change text
    setBreakButtonText("break");
    // Set breakTimerStarted false
    setBreakTimerStarted(false);
    // Alert user that time is over
    alert("Break time is over");

    setResetTimer((prev) => prev + 1);
  };

  // Setting button click event handler function
  // Opens pop up div to display settings if time is not running.
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

  // button End click event handler
  // navigates to the profile page if time is not running
  const handleEndButton = (e) => {
    e.preventDefault();
    if (timerStarted || breakTimerStarted) {
      alert("You cannot end study session while timer is still running");
    } else {
      if (currentStudyTimerMin != studyCountdown) {
        let timeStudiedInHours = (studyCountdown - currentStudyTimerMin) / 60;
        console.log("timeStudiedInHours", timeStudiedInHours);
        axios
          .post("/addtime", { id: id, timeStudied: timeStudiedInHours })
          .catch((err) => console.log(err));
      }
      navigate("/profile-user");
    }
  };

  // Helper function to renderer that adds leading 0
  // if necessary
  const zeroPad = (n) => {
    if (n < 10) {
      return "0" + n;
    }
    return n;
  };

  // Clock renderer
  const renderer = ({ minutes, seconds }) => (
    <span>
      {zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
  );

  useEffect(() => {
    setStudyTime(Date.now() + studyCountdown * 60000);
    setCurrentStudyTimerMin(studyCountdown);
  }, [studyCountdown, breakTimerStarted, resetTimer]);

  useEffect(() => {
    setBreakTime(Date.now() + breakCountdown * 60000);
  }, [breakCountdown, timerStarted, resetTimer]);

  const studyClockRef = useRef();
  const breakClockRef = useRef();
  return (
    <div
      className={`relative m-0 p-0 w-full h-screen flex flex-col items-center justify-center ${bgImage} bg-fixed bg-bottom bg-no-repeat bg-cover overflow-hidden`}
    >
      {/* Centered Div */}
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg md:w-auto w-96 bg-black/[.40] backdrop-blur-lg p-24">
        {/* Timer */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold font-sans tracking-wider ">
          STUDY{" "}
          <Countdown
            date={studyTime}
            autoStart={false}
            renderer={renderer}
            onComplete={() => handleStudyTimeEnd()}
            onPause={(e) => {
              setCurrentStudyTimerMin(e.minutes);
            }}
            ref={studyClockRef}
          />
        </h1>
        <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold font-sans tracking-wider ">
          BREAK{" "}
          <Countdown
            date={breakTime}
            autoStart={false}
            renderer={renderer}
            onComplete={() => handleBreakTimeEnd()}
            ref={breakClockRef}
          />
        </h1>
        {/* Buttons */}
        <div className="flex items-center justify-center gap-1 md:gap-2 mt-4">
          <button
            value={startButtonText}
            onClick={handleStudyButton}
            className="text-sm md:text-base lg:text-lg xl:text-xl font-sans font-semibold border-2 bg-transparent md:hover:bg-white text-white md:hover:text-slate-900 p-2 rounded-lg transition duration-150 ease-in"
          >
            {startButtonText}
          </button>
          <button
            value={breakButtonText}
            onClick={handleBreakButton}
            className="text-sm md:text-base lg:text-lg xl:text-xl font-sans font-semibold border-2 bg-transparent md:hover:bg-white text-white md:hover:text-slate-900 p-2 rounded-lg transition duration-150 ease-in"
          >
            {breakButtonText}
          </button>
          <button
            onClick={handleEndButton}
            className="text-sm md:text-base lg:text-lg xl:text-xl font-sans font-semibold border-2 bg-transparent md:hover:bg-white text-white md:hover:text-slate-900 p-2 rounded-lg transition duration-150 ease-in"
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
              className="w-10 h-10 md:w-12 md:h-12 border-2 bg-transparent md:hover:bg-white text-white md:hover:text-slate-900 rounded-lg transition duration-150 ease-in"
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
        className="invisible opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 max-h-full p-6 -translate-y-1/2 w-96 md:w-1/2 bg-black/[.40] backdrop-blur-lg text-white rounded-lg flex flex-col items-start gap-6"
      >
        {/* Study timer */}
        <div>
          <label className="font-sans font-semibold text-sm md:text-base lg:text-lg xl:text-xl">
            Study Timer
          </label>
          <input
            type="number"
            value={studyCountdown}
            onChange={(e) => {
              setStudyCountdown(e.target.value);
              // Store it in localStorage if it is valid.
              if (e.target.value > 0)
                localStorage.setItem(
                  "studypage-study-countdown",
                  e.target.value
                );
            }}
            // min="10"
            max="60"
            className="w-24 text-black font-sans font-semibold text-base md:text-lg lg:text-xl xl:text-2xl px-2 py-1 ml-4 rounded-lg"
          />
        </div>
        {/* Break Timer */}
        <div>
          <label className="font-sans font-semibold text-sm md:text-base lg:text-lg xl:text-xl">
            Break Timer
          </label>
          <input
            type="number"
            value={breakCountdown}
            onChange={(e) => {
              setBreakCountdown(e.target.value);
              // Store it in localStorage if it is valid.
              if (e.target.value > 0)
                localStorage.setItem(
                  "studypage-break-countdown",
                  e.target.value
                );
            }}
            min="0"
            max="60"
            className="w-24 text-black font-sans font-semibold text-base md:text-lg lg:text-xl xl:text-2xl px-2 py-1 ml-4 rounded-lg"
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
                localStorage.setItem("studypage-bg-image", "bg-mountain-1");
                setBgImage("bg-mountain-1");
              }}
            />
            <img
              className="w-48 rounded-lg cursor-pointer"
              src="./img/mountain_mckinley.jpg"
              alt="mountain mckinley"
              onClick={() => {
                localStorage.setItem("studypage-bg-image", "bg-mountain-2");
                setBgImage("bg-mountain-2");
              }}
            />
            <img
              className="w-48 rounded-lg cursor-pointer"
              src="./img/parth-savani-uCuZ9kscyuc-unsplash.jpg"
              alt="mountain savani "
              onClick={() => {
                localStorage.setItem("studypage-bg-image", "bg-mountain-3");
                setBgImage("bg-mountain-3");
              }}
            />
            <img
              className="w-48 rounded-lg cursor-pointer"
              src="./img/stephan-bechert-xQWelDCacZE-unsplash.jpg"
              alt="a mountain from africa"
              onClick={() => {
                localStorage.setItem("studypage-bg-image", "bg-mountain-4");
                setBgImage("bg-mountain-4");
              }}
            />
            <img
              className="w-48 rounded-lg cursor-pointer"
              src="./img/toan-chu-pKFCH2t00wA-unsplash.jpg"
              alt="a mountain from japan"
              onClick={() => {
                localStorage.setItem("studypage-bg-image", "bg-mountain-5");
                setBgImage("bg-mountain-5");
              }}
            />
            <img
              className="w-48 rounded-lg cursor-pointer"
              src="./img/tomas-malik-orQBzc7Dl3U-unsplash.jpg"
              alt="a mountain from japan"
              onClick={() => {
                localStorage.setItem("studypage-bg-image", "bg-mountain-6");
                setBgImage("bg-mountain-6");
              }}
            />
          </div>
        </div>
        <button
          onClick={() => {
            if (studyCountdown <= 0) {
              // If studyCountdown is inconsistent
              // Warn user and let user change it
              alert("Invalid Study Time!!! Please enter a valid number");
              return;
            } else if (breakCountdown <= 0) {
              // If breakCountdown is inconsistent
              // Warn user and let user change it
              alert("Invalid Break Time!!! Please enter a valid number");
              return;
            }

            // Close settings pop up div
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
