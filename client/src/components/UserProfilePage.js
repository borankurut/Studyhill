import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useLayoutEffect, useState } from "react";
import moment from "moment";

function UserProfilePage() {
  const [userName, setUserName] = useState("");
  const [day, setDay] = useState("");
  const [date, setDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [weeklyGoal, setWeeklyGoal] = useState("");
  const [weeklyHours, setweeklyHours] = useState({
    monday: 1,
    tuesday: 1,
    wednesday: 1,
    thursday: 1,
    friday: 1,
    saturday: 1,
    sunday: 1,
  });
  const [badges, setBadges] = useState([]);

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
    setTasks(["task1", "task2", "task3", "task4"]);
    setWeeklyGoal(5);
    setweeklyHours({
      monday: 5,
      tuesday: 3,
      wednesday: 6,
      thursday: 4,
      friday: 6,
      saturday: 3,
      sunday: 1,
    });
    setUserName("Foo");
  }, []);

  //For debugging
  useEffect(() => {
    console.log("day", day);
  }, [day]);
  useEffect(() => {
    console.log("date", date);
  }, [date]);

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
            if (res.data.hasGroup) navigate("/profile-group");
            // User hasn't got a group. Therefore stay in this page.
            // And set user datas respect to the response data.
            else {
              // Set user informations here.
              setBadges([...res.data.badges]);
              setTasks([...res.data.tasks]);
              setWeeklyGoal(res.data.weeklyGoal);
              setweeklyHours({ ...res.data.weeklyHours });
              setUserName(res.data.username);
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

  return (
    <div className="container mx-auto">
      <header className="bg-navbar-dark p-6 flex justify-between items-center">
        <h1 className="font-semibold text-sm md:text-base lg:text-lg xl:text-xl">
          Hi {userName},<br /> Welcome back 👋
        </h1>
        <nav className="flex items-center justify-evenly gap-6">
          <NavLink
            to="join-group"
            className="text-xs md:text-sm lg:text-base xl:text-lg px-2 py-1 md:px-4 md:py-2 font-semibold hover:text-slate-300 hover:border-slate-300 transition duration-150 ease-in"
          >
            Join A Group
          </NavLink>
          <NavLink
            to="create-group"
            className="text-xs md:text-sm lg:text-base xl:text-lg px-2 py-1 md:px-4 md:py-2 font-semibold hover:text-slate-300 hover:border-slate-300 transition duration-150 ease-in"
          >
            Create A Group
          </NavLink>
          <button
            to="join-group"
            className="text-xs md:text-sm lg:text-base xl:text-lg px-2 py-1 md:px-4 md:py-2 font-semibold hover:text-slate-300 hover:border-slate-300 transition duration-150 ease-in"
            onClick={handleLogOut}
          >
            Log Out
          </button>
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
              {tasks.map((task, i) => (
                <li
                  key={i}
                  className="text-sm md:text-base lg:text-lg xl:text-xl font-light font-sans"
                >
                  {task}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main body */}
        <main className="grow-1  w-full h-full p-6">
          {/* Weekly track div */}
          <div className="flex flex-row items-center justify-center py-2">
            <h1 className="text-sm md:text-base lg:text-lg xl:text-xl font-semibold tracking-wider">
              Weekly Track
            </h1>
          </div>

          {/* Graph */}
          <div className="relative w-64 lg:w-96 h-40  flex justify-evenly items-end mx-auto gap-2">
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
              {badges.map((badge, i) => {
                return (
                  <div
                    key={i}
                    className="flex flex-row items-center justify-start gap-4 mx-6 my-4"
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
        </main>
      </div>
    </div>
  );
}

export default UserProfilePage;
