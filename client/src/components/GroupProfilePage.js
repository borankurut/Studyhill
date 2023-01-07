import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import moment from "moment";

function GroupProfilePage(props) {
  const [userName, setUserName] = useState("");
  const [day, setDay] = useState("");
  const [date, setDate] = useState("");
  const [userID, setUserID] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [weeklyGoal, setWeeklyGoal] = useState("");

  const [newWeeklyGoal, setNewWeeklyGoal] = useState(0);

  // whole weeks
  const [wholeWeeklyHours, setWholeWeeklyHours] = useState([]);

  // Iterator for whole weeks
  const [weekIterator, setWeekIterator] = useState(0);

  const [weeklyHours, setweeklyHours] = useState({
    date: "foo",
    monday: 1,
    tuesday: 1,
    wednesday: 1,
    thursday: 1,
    friday: 1,
    saturday: 1,
    sunday: 1,
  });
  const [badges, setBadges] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [dayWinners, setDayWinners] = useState();

  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const [newTask, setNewTask] = useState("");

  // Set each data for debugging.
  useLayoutEffect(() => {
    // Set current day using momentjs
    setDay(moment().format("dddd"));
    // Set current date using momentjs
    setDate(moment().format("MMM Do YYYY"));

    // Initial values for user data before getting the real
    // datas from backend server. We need this initial values
    // for the sake of rendering properly
    // because react useLayoutEffect is run after render.
    setBadges(["badge1", "badge2", "badge3"]);
    setTasks([]);
    setWeeklyGoal(5);
    setweeklyHours({
      date: "foo",
      monday: 5,
      tuesday: 3,
      wednesday: 6,
      thursday: 4,
      friday: 6,
      saturday: 3,
      sunday: 1,
    });
    setUserName("Foo");

    setGroupMembers(["user1", "user2", "user3", "user4"]);
  }, []);

  // For the first load of the user profile page check
  // that user is already loggin or not.
  const navigate = useNavigate();
  useEffect(() => {
    // Check that whether user is already loggin or not
    if (
      localStorage.getItem("username") !== null &&
      localStorage.getItem("studyhill-device-id") !== null
    ) {
      // If there is a username and device id for studyhill exist in
      // localstorage, then post backend to that information to check that
      // whether a user with the information send exists or not.
      // If exists check that whether user has a group or not.
      // If user has a group then navigate to group profile page, else
      // stay in this page.
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
            if (!res.data.hasGroup) navigate("/profile-user");
            // User hasn't got a group. Therefore stay in this page.
            // And set user datas respect to the response data.
            else {
              // Set user informations here.
              setBadges([...res.data.badges]);
              setWeeklyGoal(res.data.weeklyGoal);
              setweeklyHours({
                ...res.data.weeklyHours[res.data.weeklyHours.length - 1],
              });

              setWholeWeeklyHours([...res.data.weeklyHours]);
              setWeekIterator(res.data.weeklyHours.length - 1);

              setUserName(res.data.username);
              setUserID(res.data.id);
            }
          }
        })
        // Catch and print error to the console if an error happends during
        // communication with backend server
        .catch((err) => console.log(err));
    } else {
      // User hasn't logged in yet!
      // navigate to login page.
      navigate("/login");
    }
  }, []);

  const handleLogOut = (e) => {
    // Do not let default behoviour of button when clicked
    e.preventDefault();

    // post a request to logout user from this device
    // simple by deleting unique device id stored in database
    axios
      .post("/logout", {
        username: localStorage.getItem("username"),
        uniqeDeviceID: localStorage.getItem("studyhill-device-id"),
      })
      .then((res) => {
        // remove username and studyhill-device-id from localstorage
        localStorage.removeItem("username");
        localStorage.removeItem("studyhill-device-id");

        // navigate to homepage
        navigate("/");
      })
      // Catch and log error
      .catch((err) => {
        console.log(err);
      });
  };

  const navbar = useRef();

  const toggleNavbar = (e) => {
    e.preventDefault();
    if (isNavbarOpen) {
      navbar.current.classList.add("invisible", "opacity-0");
      setIsNavbarOpen(false);
    } else {
      navbar.current.classList.remove("invisible", "opacity-0");
      setIsNavbarOpen(true);
    }
  };

  const handleLeaveGroup = (e) => {
    e.preventDefault();

    axios.put("/leavegroup", { id: userID }).then((res) => {
      if (res.data.msg === "Leaved") {
        navigate("/profile-user");
      } else {
        alert("Something went wrong while leaving group!!! Please try again");
      }
    });
  };

  // Add new task
  const addNewTask = (e) => {
    e.preventDefault();

    if (newTask !== "") {
      setTasks((prev) => [...prev, newTask]);
      setNewTask("");
    }
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    setweeklyHours({ ...wholeWeeklyHours[weekIterator] });
  }, [weekIterator]);

  return (
    <div className="container mx-auto">
      <header className="relative bg-navbar-dark p-6 flex justify-between items-center">
        <h1 className="font-semibold text-base md:text-lg lg:text-xl xl:text-2xl">
          Hi {userName},<br /> Welcome back 👋
        </h1>

        {/* large screen navbar */}
        <nav className="hidden md:flex items-center justify-end gap-6 p-6">
          <button
            onClick={handleLeaveGroup}
            className="lg:text-lg xl:text-xl font-semibold hover:text-slate-300 hover:border-slate-300 transition duration-150 ease-in"
          >
            Leave The Group
          </button>
          <button
            className="lg:text-lg xl:text-xl font-semibold hover:text-slate-300 hover:border-slate-300 transition duration-150 ease-in"
            onClick={handleLogOut}
          >
            Log Out
          </button>
        </nav>

        {/* small screen navbar */}
        <nav
          ref={navbar}
          className="invisible opacity-0 absolute left-0 top-full bg-inherit w-full flex flex-col md:hidden jusitfy-start items-start gap-4 p-6 transition duration-150 ease-in"
        >
          <button
            onClick={handleLeaveGroup}
            className="text-base font-semibold hover:text-slate-300 hover:border-slate-300 transition duration-150 ease-in"
          >
            Leave The Group
          </button>
          <button
            className="text-base font-semibold hover:text-slate-300 hover:border-slate-300 transition duration-150 ease-in"
            onClick={handleLogOut}
          >
            Log Out
          </button>
        </nav>

        {/* Hamburger Button */}
        <button className="md:hidden cursor-pointer" onClick={toggleNavbar}>
          <div className="w-6 h-1 bg-white my-1"></div>
          <div className="w-6 h-1 bg-white my-1"></div>
          <div className="w-6 h-1 bg-white my-1"></div>
        </button>
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
            className="flex gap-2 p-4 my-4 md:my-6 border border-white hover:border-slate-300 transition duration-150 ease-in font-bold text-sm md:text-base lg:text-lg xl:text-xl rounded-md hover:bg-white hover:text-navbar-dark"
          >
            Start Study
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
          </NavLink>
          {/* Task Div */}
          <div className="border border-white rounded-lg px-6 py-4 flex flex-col items-center justify-center">
            <span className="text-sm md:text-base lg:text-lg xl:text-xl font-extrabold mb-4 flex gap-2 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
                />
              </svg>
              Tasks
            </span>
            <ul className="list-disc flex flex-col gap-6">
              {tasks.map((task, i) => (
                <li
                  key={i}
                  className="flex text-sm md:text-base lg:text-lg xl:text-xl font-light font-sans w-full justify-between"
                >
                  {/* Task */}
                  {task}
                  {/* Delete Button to delete current task */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setTasks((prev) => {
                        let itemDeleted = prev[i];
                        let tasksLeft = prev.filter(
                          (item) => item !== itemDeleted
                        );
                        return [...tasksLeft];
                      });
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            {/* Add task button */}
            <form className="mt-8">
              <textarea
                type="text"
                value={newTask}
                className="text-black w-full my-4 p-1 outline-navbar-dark text-base rounded-sm"
                required
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Please enter task here"
              />
              <button
                className="flex gap-2 font-sans font-semibold text-base text-white hover:text-slate-300"
                onClick={addNewTask}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Add a new task
              </button>
            </form>
          </div>
        </aside>

        {/* Main body */}
        <main className="grow-1  w-full h-full p-6 flex flex-col items-center justify-center gap-6">
          {/* Wrapper div for main to handle small devices */}
          <div className="w-64 lg:w-96">
            {/* Weekly track div */}
            <div className="flex flex-col items-center justify-center py-2 gap-2">
              <h1 className="text-sm md:text-base lg:text-lg xl:text-xl font-semibold tracking-wider">
                Weekly Track
              </h1>

              {/* weekly button part */}
              <div className="flex gap-2 font-sans text-sm md:text-base lg:text-lg xl:text-xl font-semibold tracking-wider">
                {/* Left arrow */}
                <button
                  className="border rounded-md hover:text-navbar-dark hover:bg-white cursor-pointer transition duration-150 ease-in"
                  disabled={weekIterator === 0}
                  onClick={(e) => {
                    e.preventDefault();
                    setWeekIterator((prev) => prev - 1);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>

                {/* weekly date */}
                {weeklyHours.date}

                {/* Right arrow */}
                <button
                  className="border rounded-md hover:text-navbar-dark hover:bg-white cursor-pointer transition duration-150 ease-in"
                  disabled={weekIterator === wholeWeeklyHours.length - 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setWeekIterator((prev) => prev + 1);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-xs md:text-sm lg:text-base xl:text-lg font-semibold tracking-wider">
                Weekly Goal is {weeklyGoal}h
              </p>

              <form className="flex gap-2 text-sm md:text-base lg:text-lg xl:text-xl font-semibold tracking-wider">
                <input
                  value={newWeeklyGoal}
                  type="number"
                  min="1"
                  max="10"
                  className="px-2 text-black rounded-md"
                  onChange={(e) => {
                    e.preventDefault();
                    setNewWeeklyGoal(e.target.value);
                  }}
                />
                <button
                  className="py-1 px-2 border border-white hover:border-slate-300 transition duration-150 ease-in font-semibold text-sm md:text-base lg:text-lg xl:text-xl rounded-md hover:bg-white hover:text-navbar-dark"
                  onClick={(e) => {
                    e.preventDefault();
                    axios
                      .post("/change-weeklygoal", {
                        id: userID,
                        weeklyGoal: newWeeklyGoal,
                      })
                      .then(() => navigate("/login"))
                      .catch((err) => console.log(err));
                  }}
                >
                  Set weekly Goal
                </button>
              </form>
            </div>

            {/* Graph */}
            <div className="relative w-full h-40  flex justify-evenly items-end mx-auto gap-2">
              <div
                className="relative w-12 bg-cyan-400 rounded-t-sm"
                style={{ height: `${weeklyHours.monday}rem` }}
              >
                <p className="text-xs md:text-sm lg:text-base xl:text-lg w-fit absolute bottom-0 right-0 rotate-[-60deg] translate-y-10 md:translate-y-16">
                  Monday
                </p>
              </div>
              <div
                className="relative w-12 bg-cyan-400 rounded-t-sm"
                style={{ height: `${weeklyHours.tuesday}rem` }}
              >
                <p className="text-xs md:text-sm lg:text-base xl:text-lg w-fit absolute bottom-0 right-0 rotate-[-60deg] translate-y-10 md:translate-y-16">
                  Tuesday
                </p>
              </div>
              <div
                className="relative w-12 bg-cyan-400 rounded-t-sm"
                style={{ height: `${weeklyHours.wednesday}rem` }}
              >
                <p className="text-xs md:text-sm lg:text-base xl:text-lg w-fit absolute bottom-0 right-0 rotate-[-60deg] translate-y-10 md:translate-y-16">
                  Wednesday
                </p>
              </div>
              <div
                className="relative w-12 bg-cyan-400 rounded-t-sm"
                style={{ height: `${weeklyHours.thursday}rem` }}
              >
                <p className="text-xs md:text-sm lg:text-base xl:text-lg w-fit absolute bottom-0 right-0 rotate-[-60deg]  translate-y-10 md:translate-y-16">
                  Thursday
                </p>
              </div>
              <div
                className="relative w-12 bg-cyan-400 rounded-t-sm"
                style={{ height: `${weeklyHours.friday}rem` }}
              >
                <p className="text-xs md:text-sm lg:text-base xl:text-lg w-fit absolute bottom-0 right-0 rotate-[-60deg] translate-y-10 md:translate-y-16">
                  Friday
                </p>
              </div>
              <div
                className="relative w-12 bg-cyan-400 rounded-t-sm"
                style={{ height: `${weeklyHours.saturday}rem` }}
              >
                <p className="text-xs md:text-sm lg:text-base xl:text-lg w-fit absolute bottom-0 right-0 rotate-[-60deg] translate-y-10 md:translate-y-16">
                  Saturday
                </p>
              </div>
              <div
                className="relative w-12 bg-cyan-400 rounded-t-sm"
                style={{ height: `${weeklyHours.sunday}rem` }}
              >
                <p className="text-xs md:text-sm lg:text-base xl:text-lg w-fit absolute bottom-0 right-0 rotate-[-60deg] translate-y-10 md:translate-y-16">
                  Sunday
                </p>
              </div>

              <div
                className="w-64 lg:w-[28rem] bg-white rounded-t-sm h-1 absolute left:0"
                style={{ bottom: `${weeklyGoal}rem` }}
              >
                <div className="text-xs md:text-sm lg:text-base xl:text-lg font-sans font-light w-12 absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
                  {weeklyGoal}h
                </div>
              </div>
            </div>

            {/* Badges Collection Div */}
            <div className="w-full mt-32 md:mt-52 flex flex-col items-start justify-start gap-6">
              <div className="p-6 md:p-0 flex flex-row items-center justfiy-start gap-2">
                <h1 className="font-extrabold font-sans text-sm md:text-base lg:text-lg xl:text-xl">
                  Badge Collection
                </h1>
                <span className="p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                </span>
              </div>
              {/* Badge Collection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {badges.map((badge, i) => {
                  return (
                    <div
                      key={i}
                      className="flex flex-row items-center justify-start gap-4"
                    >
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
          </div>
        </main>
      </div>
    </div>
  );
}

export default GroupProfilePage;
