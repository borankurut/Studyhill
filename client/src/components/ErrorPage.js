import { NavLink } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="w-96 md:w-2/3 text-center">
        <h1 className="p-6 font-semibold text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          404
        </h1>
        <p className="py-6 text-base md:text-lg lg:text-xl xl:text-2xl font-bold">
          There is no problem with internet, but we couldn't find what you are
          looking for.
        </p>
        <NavLink
          to="/"
          className="underline p-6 text-sm md:text-base lg:text-lg xl:text-xl text-white hover:text-slate-200 transition duration-150 ease-in-out"
        >
          Go to home page
        </NavLink>
      </div>
    </div>
  );
}

export default ErrorPage;
