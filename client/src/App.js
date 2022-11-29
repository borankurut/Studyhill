import { Route, Routes, NavLink } from "react-router-dom";
import HomePage from "./components/HomePage.js";
import StudyPage from "./components/StudyPage.js";
import AvatarPage from "./components/AvatarPage.js";
import ErrorPage from "./components/ErrorPage.js";
import GroupProfilePage from "./components/GroupProfilePage.js";
import UserProfilePage from "./components/UserProfilePage.js";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {
  document.body.classList.add("bg-body-dark", "text-white");

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/study-page" element={<StudyPage />} />
      <Route path="/avatar" element={<AvatarPage />} />
      <Route path="/profile-user" element={<UserProfilePage />} />
      <Route path="/profile-group" element={<GroupProfilePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;