import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function CreateGroup() {
  const [userName, setUserName] = useState("Foo");
  const [userID, setUserID] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [isGroupNameValid, setIsGroupNameValid] = useState(false);
  const [groupSize, setGroupSize] = useState(0);
  const [isGroupSizeValid, setIsGroupSizeValid] = useState(false);

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
    if (groupName !== "" && /^[A-Za-z0-9 ]*$/.test(groupName)) {
      setIsGroupNameValid(true);
    } else {
      setIsGroupNameValid(false);
    }
  }, [groupName]);

  useEffect(() => {
    if (groupSize >= 2 && groupSize <= 8) {
      setIsGroupSizeValid(true);
    } else {
      setIsGroupSizeValid(false);
    }
  }, [groupSize]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put("/creategroup", {
        id: userID,
        groupName: groupName,
        maxSize: groupSize,
      })
      .then((res) => {
        if (res.data.msg === "created") {
          navigate("/profile-group");
        } else {
          alert("There is something wrong!!! Please try again.");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mx-auto h-screen w-screen flex flex-col items-center justify-center">
      <div className="text-center bg-navbar-dark p-16 md:p-24 shadow-md shadow-navbar-dark">
        <h1 className="uppercase font-sans font-semibold text-xl md:text-2xl lg:text-3xl xl:text-4xl tracking-widest mb-8">
          Create Group
        </h1>
        <form className="flex flex-col items-center justify-center gap-4 w-full py-6">
          <small className="self-start text-left">
            Group name can contain only lowercase letters and digits
          </small>
          <input
            name="code"
            type="text"
            required
            autocomplete="off"
            placeholder="Please Enter Group Name"
            className="text-black w-full p-2 outline-navbar-dark text-base md:text-lg lg:text-xl xl:text-2xl rounded-sm"
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
          />

          <small className="self-start">Group size must be 2-8</small>
          <input
            name="size"
            type="number"
            required
            autocomplete="off"
            placeholder="Please Enter Group Size"
            className="text-black w-full p-2 outline-navbar-dark text-base md:text-lg lg:text-xl xl:text-2xl rounded-sm"
            onChange={(e) => {
              setGroupSize(e.target.value);
            }}
          />

          <div className="w-full flex justify-between gap-1">
            <button
              onClick={handleSubmit}
              disabled={!isGroupNameValid || !isGroupSizeValid}
              className="text-navbar-dark bg-white w-32 py-4 px-6 font-bold text-base md:text-lg lg:text-xl xl:text-2xl rounded-md hover:bg-slate-200 transition duration-150 ease-in"
            >
              Create
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
  );
}

export default CreateGroup;
