import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

function GroupProfilePage(props) {
  const navigate = useNavigate();

  // Check that whether user is already loggin or not
  if (
    localStorage.getItem("username") !== null &&
    localStorage.getItem("studyhill-device-id") !== null
  ) {
    axios
      .post("/check-already-login", {
        username: localStorage.getItem("username"),
        uniqeDeviceID: localStorage.getItem("studyhill-device-id"),
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.verification) {
          // User already loggin
          // If user has no group navigate to user profile page
          if (!res.data.hasGroup) navigate("/profile-user");
        } else {
          // User is not loggin. Navigate to Login Page
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <h1 className="font-semibold text-xl font-sans">GroupProfilePage</h1>
      <NavLink to="/" className="underline text-lg">
        Go to Home page
      </NavLink>
    </div>
  );
}

export default GroupProfilePage;
