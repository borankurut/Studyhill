import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudyPage() {
  const [timerStarted, setTimerStarted] = useState(false);
  const [totalStudyTime, setTotalStudyTime] = useState();
  const [timeToSubmit, setTimeToSubmit] = useState();

  const navigate = useNavigate();

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
          }
        })
        // Catch and print error to the console if an error happends during
        // communication with backend server
        .catch((err) => console.log(err));
    }
  }, []);

  var time = "25:00";
  var startButtonText = "start";

  // TODO
  const startTimer = () => {
    console.log("startTimer");
  };

  // TODO
  const stopTimer = () => {
    console.log("stopTimer");
  };

  const handleStartButton = () => {
    if (timerStarted) {
      stopTimer();
      startButtonText = "start";
      setTimerStarted(false);
    } else {
      startTimer();
      startButtonText = "stop";
      setTimerStarted(true);
    }
  };

  const handleSubmitingTimeStudied = (e) => {
    e.preventDefault();

    // Set submitTime to totalStudyTime to submit the time studied
    // to backend
    setTimeToSubmit(totalStudyTime);
    // Navigate to profile page
    navigate("/profile-user");
  };

  return (
    <div className="relative m-0 p-0 w-full h-screen flex flex-col items-center justify-center bg-mountain-agri bg-fixed bg-bottom bg-no-repeat bg-cover">
      {/* Centered Div */}
      <div className="flex flex-col items-center justify-center gap-6 -translate-y-1/2">
        {/* Timer */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold font-sans tracking-wide ">
          {time}
        </h1>
        {/* Buttons */}
        <div className="flex flex-row items-center justify-center gap-6">
          <button
            onClick={handleStartButton}
            className="text-sm md:text-base lg:text-lg xl:text-xl font-sans font-semibold border-2 bg-transparent hover:bg-white text-white hover:text-slate-900 px-4 py-2 rounded-lg transition duration-150 ease-in"
          >
            {startButtonText}
          </button>
          <button className="text-sm md:text-base lg:text-lg xl:text-xl font-sans font-semibold border-2 bg-transparent hover:bg-white text-white hover:text-slate-900 px-4 py-2 rounded-lg transition duration-150 ease-in">
            break
          </button>
          <button
            onClick={handleSubmitingTimeStudied}
            className="text-sm md:text-base lg:text-lg xl:text-xl font-sans font-semibold border-2 bg-transparent hover:bg-white text-white hover:text-slate-900 px-4 py-2 rounded-lg transition duration-150 ease-in"
          >
            end
          </button>
          <button>
            <img
              src="./img/icons8-reset-100.png"
              alt="reset icon"
              className="w-[35px] h-[35px]"
            />
          </button>
          <button>
            <img
              src="./img/icons8-gear-100.png"
              alt="gear icon"
              className="w-[35px] h-[35px]"
            />
          </button>
        </div>
      </div>

      {/* Information about background image */}
      <div className="absolute bottom-8 left-6 text-xs md:text-sm lg:text-base xl:text-lg font-sans font-semibold text-white tracking-wider">
        mountain
        <br />
        Ağrı - Türkiye
      </div>

      {/* Studyhill footer logo */}
      <h1 className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm md:text-base lg:text-lg xl:text-xl font-bold tracking-widest text-white">
        STUDYHILL
      </h1>
    </div>
  );
}

export default StudyPage;
