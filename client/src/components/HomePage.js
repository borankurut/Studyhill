import { NavLink } from "react-router-dom";

import { useState } from "react";

function HomePage() {
  const [data, setData] = useState([{}]);

  fetch("/")
    .then((response) => response.json)
    .then((responseData) => setData(responseData));

  return <>{typeof data === "undefined" ? <></> : <p>{data}</p>}</>;

  return (
    <div className="container mx-auto">
      <header className="bg-navbar-dark p-6 rounded-sm flex items-center justify-between">
        <NavLink
          to="/"
          className="text-base md:text-lg lg:text-xl xl:text-2xl tracking-[4px] font-sans font-semibold"
        >
          STUDYHILL
        </NavLink>
        <nav className="flex items-center justify-center gap-6">
          <NavLink
            to="/sign-up"
            className="p-2 md:px-4 md:py-3 border-2 border-white bg-transparent hover:text-slate-200 hover:border-slate-200 text-sm md:text-base lg:text-lg xl:text-xl rounded-xl font-semibold transition duration-150 ease-in"
          >
            Sign Up
          </NavLink>
          <NavLink
            to="/login"
            className="p-2 md:px-4 md:py-3 border-2 border-white bg-transparent hover:text-slate-200 hover:border-slate-200 text-sm md:text-base lg:text-lg xl:text-xl rounded-xl font-semibold transition duration-150 ease-in"
          >
            Log In
          </NavLink>
        </nav>
      </header>

      <main>
        <section className="flex flex-col-reverse md:flex-row gap-4 p-6">
          <div className="flex-1 flex-col items-start justify-center">
            <p className="font-sans font-bold text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-wide my-1 md:my-2">
              <span className="text-red-500">Study</span> by yourself or with
              your friends
            </p>
            <p className="font-sans font-bold text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-wide my-1 md:my-2">
              Compare your <span className="text-red-500">Study</span> times
            </p>
            <p className="font-sans font-bold text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-wide my-1 md:my-2">
              Gain success as you <span className="text-red-500">Study</span>
            </p>
          </div>
          <div className="flex-1">
            <img
              className="w-full aspect-video rounded-sm"
              src="./img/scott-graham-5fNmWej4tAA-unsplash.jpg"
            />
          </div>
        </section>

        <section className="flex flex-col md:flex-row gap-4 p-6">
          <div className="flex-1">
            <img
              className="w-full aspect-video rounded-sm"
              src="./img/annie-spratt-dWYU3i-mqEo-unsplash.jpg"
            />
          </div>
          <div className="flex-1 flex flex-col items-start md:items-end justify-center md:text-right">
            <p className="font-sans font-bold text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-wide my-1 md:my-2 ">
              Create or join <span className="text-red-500">Study</span> groups
            </p>
            <p className="font-sans font-bold text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-wide my-1 md:my-2">
              Track your <span className="text-red-500">Study</span> times
            </p>
            <p className="font-sans font-bold text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-wide my-1 md:my-2">
              Earn badges based on your{" "}
              <span className="text-red-500">Study</span> performance
            </p>
          </div>
        </section>

        <section className="flex flex-col-reverse md:flex-row gap-4 p-6">
          <div className="flex-1 flex flex-col items-start justify-center">
            <p className="font-sans font-bold text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-wide my-1 md:my-2">
              Increase your <span className="text-red-500">Study</span>{" "}
              motivation and productivity
            </p>
            <NavLink
              to="/login"
              className="p-4 bg-red-500 rounded-xl font-semibold font-sans tracking-widest hover:bg-red-600 transition duration-150 ease-in"
            >
              STUDY NOW
            </NavLink>
          </div>
          <div className="flex-1">
            <img
              className="w-full aspect-video rounded-sm"
              src="./img/scott-graham-5fNmWej4tAA-unsplash.jpg"
            />
          </div>
        </section>
      </main>

      <footer className="bg-navbar-dark flex flex-col items-center justify-center p-8 md:p-10 lg:p-12 xl:p-14 rounded-sm">
        <div className="text-center">
          <p className="text-base md:text-lg lg:text-xl xl:text-2xl">
            Studyhill, 2022
          </p>
          <p className="text-base md:text-lg lg:text-xl xl:text-2xl">
            Company &copy; SNOWHILL
          </p>
          <p className="font-semibold text-sm md:text-base lg:text-lg xl:text-xl">
            All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
