import { NavLink } from "react-router-dom";

function GroupProfilePage() {
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
