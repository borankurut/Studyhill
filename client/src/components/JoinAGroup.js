import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function JoinAGroup() {
  const [userName, setUserName] = useState("Foo");
  const [userID, setUserID] = useState(0);
  const [groupCode, setGroupCode] = useState("");
  const [isGroupCodeValid, setIsGroupCodeValid] = useState(false);

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
            if (res.data.hasGroup) {
              // User already has a group
              // Do not let enter this page
              // Navigate to profile-group page
              navigate("/profile-group");
            } else {
              setUserName(res.data.username);
              setUserID(res.data.id);
            }
          } else {
            navigate("/login");
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

  useEffect(() => {
    if (groupCode.length == 4 && /^[a-z0-9]*$/.test(groupCode)) {
      setIsGroupCodeValid(true);
    } else {
      setIsGroupCodeValid(false);
    }
  }, [groupCode]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put("/joingroup", { id: userID, groupCode: groupCode })
      .then((res) => {
        if (res.data.msg === "Added") {
          navigate("/profile-group");
        } else if (res.data.msg === "Invalid Code") {
          alert("Invalid Code");
        } else if (res.data.msg === "Group is full") {
          alert("Group is full");
        } else {
          alert("There is something wrong!!! Please try again.");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="container mx-auto h-screen w-screen flex flex-col items-center justify-center">
        <div className="text-center bg-navbar-dark p-16 md:p-24 shadow-md shadow-navbar-dark">
          <h1 className="font-sans font-semibold text-xl md:text-2xl lg:text-3xl xl:text-4xl tracking-widest mb-8">
            JOIN A GROUP
          </h1>
          <form className="flex flex-col items-center justify-center gap-4 w-full py-6">
            <input
              name="code"
              type="text"
              minLength={4}
              maxLength={4}
              required
              autocomplete="off"
              placeholder="Enter Group Code"
              className="text-black w-full p-2 outline-navbar-dark text-base md:text-lg lg:text-xl xl:text-2xl rounded-sm"
              onChange={(e) => {
                setGroupCode(e.target.value);
              }}
            />

            <div className="w-full flex justify-between gap-1">
              <button
                onClick={handleSubmit}
                disabled={!isGroupCodeValid}
                className="text-navbar-dark bg-white w-32 py-4 px-6 font-bold text-base md:text-lg lg:text-xl xl:text-2xl rounded-md hover:bg-slate-200 transition duration-150 ease-in"
              >
                Join
              </button>
              <Link
                to="/profile-user"
                className="text-navbar-dark bg-white w-32 py-4 px-6 font-bold text-base md:text-lg lg:text-xl xl:text-2xl rounded-md hover:bg-slate-200 transition duration-150 ease-in"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default JoinAGroup;
