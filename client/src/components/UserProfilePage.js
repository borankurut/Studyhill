import { NavLink } from "react-router-dom";

function UserProfilePage() {
  const userName = "Bond007";
  const day = "Saturday";
  const week = "21 Nov - 27 November";
  const date = "26 November";
  const tasks = [
    "Wake Up at 8:00 AM",
    "Jog for half an hour",
    "Join the scrum",
    "Study Software Engineering Lecture for 2 hours",
    "Study Programming Languages Lecture for 2 hours",
    "Read a book for 1 hour",
    "Watch Movie",
  ];
  const weeklyGoal = 4;

  const weeks = {
    Monday: 4,
    Tuesday: 6,
    Wednesday: 5,
    Thursday: 5,
    Friday: 6,
    Saturday: 3,
    Sunday: 8,
  };

  const badges = ["award1", "award2", "award3", "award4", "award5", "award6"];
  return (
    <div className="container mx-auto">
      <header className="bg-navbar-dark p-6 flex justify-between items-center">
        <h1 className="font-semibold text-sm md:text-base lg:text-lg xl:text-xl">
          Hi {userName},<br /> Welcome back 👋
        </h1>
        <nav className="flex items-center justify-evenly gap-6">
          <NavLink
            to="join-group"
            className="text-xs md:text-sm lg:text-base xl:text-lg px-2 py-1 md:px-4 md:py-2 border border-white rounded-md font-semibold hover:text-slate-300 hover:border-slate-300 transition duration-150 ease-in"
          >
            Join
            <br />A Group
          </NavLink>
          <NavLink
            to="create-group"
            className="text-xs md:text-sm lg:text-base xl:text-lg px-2 py-1 md:px-4 md:py-2 border border-white rounded-md font-semibold hover:text-slate-300 hover:border-slate-300 transition duration-150 ease-in"
          >
            Create
            <br /> A Group
          </NavLink>
        </nav>
      </header>

      {/* Container flex div for rest of body */}
      <div className="w-full flex flex-col md:flex-row py-6">
        {/* Sidebar */}
        <aside className="w-full md:w-96 p-6 grow-0 flex flex-col items-center md:items-start border-b-2 border-b-white md:border-b-0 md:border-r-2 md:border-r-white justify-start md:h-full">
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-sans tracking-wider mb-1">
            {day}
          </h1>
          <h2 className="text-base md:text-lg lg:text-xl xl:text-2xl font-semibold">
            {date}
          </h2>
          <NavLink
            to="/study-page"
            className="p-4 my-4 md:my-6 border border-white hover:border-slate-300 transition duration-150 ease-in font-bold text-sm md:text-base lg:text-lg xl:text-xl hover:text-slate-300 rounded-md"
          >
            Start <span className="text-red-500">study</span>
          </NavLink>
          <div className="border border-white rounded-lg px-6 py-4 flex flex-col items-center justify-center">
            <h3 className="text-sm md:text-base lg:text-lg xl:text-xl font-extrabold flex items-center justify-center gap-2">
              <button className="border-2 border-white rounded-md px-2 py-0  hover:text-slate-300 hover:border-slate-300 transition duration-150 ease-in">
                -
              </button>
              Tasks{" "}
              <button className="border-2 border-white rounded-md px-2 py-0 hover:text-slate-300 hover:border-slate-300 transition duration-150 ease-in">
                +
              </button>
            </h3>
            <hr className="my-6" />
            <ul className="list-disc">
              {tasks.map((task) => (
                <li className="text-sm md:text-base lg:text-lg xl:text-xl font-light font-sans">
                  {task}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main body */}
        <main className="grow-1  w-full h-full p-6">
          {/* Weekly track div */}
          <div className="flex flex-row items-center justify-center py-2 gap-2 md:gap-4 lg:gap-6 xl:gap-8">
            <h1 className="text-sm md:text-base lg:text-lg xl:text-xl font-semibold tracking-wider">
              Weekly Track
            </h1>
            <div className="self-center flex flex-row items-center justify-center gap-2">
              <button className="font-extrabold border-2 border-white rounded-md px-2 py-1 text-sm md:text-base lg:text-lg xl:text-xl hover:border-slate-300 hover:text-slate-300 transition duration-150 ease-in">
                &#60;
              </button>
              <span className="font-semibold text-xs md:text-sm lg:text-base xl:text-lg border-2 border-white rounded-md px-2 py-1">
                {week}
              </span>
              <button className="font-extrabold border-2 border-white rounded-md px-2 py-1 text-sm md:text-base lg:text-lg xl:text-xl hover:border-slate-300 hover:text-slate-300 transition duration-150 ease-in">
                &#62;
              </button>
            </div>

            <button className="border-2 border-white hover:border-slate-300 px-2 py-1 md:py-2 rounded-md transition duration-150 ease-in">
              <img
                src="./img/icons8-line-chart-100.png"
                alt="Stats Icon"
                className="w-6"
              />
            </button>
          </div>

          {/* Graph */}
          <div className="relative w-72 lg:w-96 h-40  flex justify-evenly items-end mx-auto gap-2">
            <div
              className="relative w-12 bg-cyan-400 rounded-t-sm"
              style={{ height: `${weeks.Monday}rem` }}
            >
              <p className="text-xs md:text-sm lg:text-base xl:text-lg w-fit absolute bottom-0 right-0 rotate-[-60deg] translate-y-10 md:translate-y-16">
                Monday
              </p>
            </div>
            <div
              className="relative w-12 bg-cyan-400 rounded-t-sm"
              style={{ height: `${weeks.Tuesday}rem` }}
            >
              <p className="text-xs md:text-sm lg:text-base xl:text-lg w-fit absolute bottom-0 right-0 rotate-[-60deg] translate-y-10 md:translate-y-16">
                Tuesday
              </p>
            </div>
            <div
              className="relative w-12 bg-cyan-400 rounded-t-sm"
              style={{ height: `${weeks.Wednesday}rem` }}
            >
              <p className="text-xs md:text-sm lg:text-base xl:text-lg w-fit absolute bottom-0 right-0 rotate-[-60deg] translate-y-10 md:translate-y-16">
                Wednesday
              </p>
            </div>
            <div
              className="relative w-12 bg-cyan-400 rounded-t-sm"
              style={{ height: `${weeks.Thursday}rem` }}
            >
              <p className="text-xs md:text-sm lg:text-base xl:text-lg w-fit absolute bottom-0 right-0 rotate-[-60deg]  translate-y-10 md:translate-y-16">
                Thursday
              </p>
            </div>
            <div
              className="relative w-12 bg-cyan-400 rounded-t-sm"
              style={{ height: `${weeks.Friday}rem` }}
            >
              <p className="text-xs md:text-sm lg:text-base xl:text-lg w-fit absolute bottom-0 right-0 rotate-[-60deg] translate-y-10 md:translate-y-16">
                Friday
              </p>
            </div>
            <div
              className="relative w-12 bg-cyan-400 rounded-t-sm"
              style={{ height: `${weeks.Saturday}rem` }}
            >
              <p className="text-xs md:text-sm lg:text-base xl:text-lg w-fit absolute bottom-0 right-0 rotate-[-60deg] translate-y-10 md:translate-y-16">
                Saturday
              </p>
            </div>
            <div
              className="relative w-12 bg-cyan-400 rounded-t-sm"
              style={{ height: `${weeks.Sunday}rem` }}
            >
              <p className="text-xs md:text-sm lg:text-base xl:text-lg w-fit absolute bottom-0 right-0 rotate-[-60deg] translate-y-10 md:translate-y-16">
                Sunday
              </p>
            </div>

            <div
              className="w-72 lg:w-[28rem] bg-white rounded-t-sm h-1 absolute left:0"
              style={{ bottom: `${weeklyGoal}rem` }}
            >
              <div className="text-xs md:text-sm lg:text-base xl:text-lg font-sans font-light w-12 absolute top-0 left-0 -translate-x-full -translate-y-1/2">
                Weekly goal <br /> {weeklyGoal}h
              </div>
            </div>
          </div>

          {/* Badges Collection Div */}
          <div className="max-w-96 md:max-w-md lg:max-w-lg xl:max-w-xl mt-36 mx-auto flex flex-col items-start justify-start gap-6">
            <div className="p-6 md:p-0 flex flex-row items-center justfiy-start gap-2">
              <h1 className="font-extrabold font-sans text-sm md:text-base lg:text-lg xl:text-xl">
                Badge Collection
              </h1>
              <button className="w-[37.5px] h-[37.5px] p-1 border-2 border-white rounded-md hover:border-slate-300 transition duration-150 ease-in">
                <img src="./img/icons8-trophy-cup-100.png" alt="Badge icon" />
              </button>
            </div>
            {/* Badge Collection */}
            <div className="grid grid-cols-2 lg:grid-cols-3">
              {badges.map((badge) => {
                return (
                  <div className="flex flex-row items-center justify-start gap-4 mx-6 my-4">
                    <div className="w-6 h-6 bg-cyan-400">
                      <div className="w-6 h-6 bg-cyan-400 rotate-45"></div>
                    </div>
                    <div className="text-sm md:text-base lg:text-lg xl:text-xl font-normal font-sans">
                      {badge}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default UserProfilePage;
