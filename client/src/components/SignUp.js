import { Link } from "react-router-dom";

function SignUp() {
  return (
    <div className="container mx-auto h-screen w-screen flex flex-col items-center justify-center">
      <div className="text-center bg-navbar-dark py-8 px-12 shadow-md shadow-navbar-dark rounded-md">
        <h1 className="font-sans font-semibold text-sm md:text-base lg:text-lg xl:text-xl tracking-widest mb-8">
          STUDYHILL SIGN UP
        </h1>
        <form
          action="/profile-user"
          method="GET"
          className="flex flex-col items-center justify-center gap-4 w-full py-6 border-b-2"
        >
          <input
            name="email"
            type="email"
            required
            placeholder="Please enter your email"
            className="text-black w-full p-2 outline-navbar-dark text-xs md:text-sm lg:text-base xl:text-lg rounded-sm"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Please enter your password"
            className="text-black w-full p-2 outline-navbar-dark text-xs md:text-sm lg:text-base xl:text-lg rounded-sm"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Please confirm your password"
            className="text-black w-full p-2 outline-navbar-dark text-xs md:text-sm lg:text-base xl:text-lg rounded-sm"
          />
          <button
            type="submit"
            className="text-navbar-dark bg-white py-4 px-6 font-bold text-xs md:text-sm lg:text-base xl:text-lg rounded-md hover:bg-slate-200 transition duration-150 ease-in"
          >
            SIGN UP
          </button>
        </form>

        <Link
          to="/login"
          className="font-semibold underline text-sm md:text-base lg:text-lg xl:text-xl m-6 hover:text-slate-200 transition duration-150 ease-in inline-block"
        >
          Already have an account?
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
