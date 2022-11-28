import { useState } from "react";
import { NavLink } from "react-router-dom";

function StudyPage() {
  const [timerStarted, setTimerStarted] = useState(false);

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
          <NavLink
            to="/profile-user"
            className="text-sm md:text-base lg:text-lg xl:text-xl font-sans font-semibold border-2 bg-transparent hover:bg-white text-white hover:text-slate-900 px-4 py-2 rounded-lg transition duration-150 ease-in"
          >
            break
          </NavLink>
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
