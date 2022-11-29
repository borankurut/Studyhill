import { Link } from "react-router-dom";

function SignUp() {
  return (
    <div className="container mx-auto h-screen w-screen flex flex-col items-center justify-center">
      <div className="text-center bg-navbar-dark p-16 md:p-24 shadow-md shadow-navbar-dark">
        <h1 className="font-sans font-semibold text-xl md:text-2xl lg:text-3xl xl:text-4xl tracking-widest mb-8">
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
            className="text-black w-full p-2 outline-navbar-dark text-sm md:text-base lg:text-lg xl:text-xl rounded-sm"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Please enter your password"
            className="text-black w-full p-2 outline-navbar-dark text-sm md:text-base lg:text-lg xl:text-xl rounded-sm"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Please re-enter your password"
            className="text-black w-full p-2 outline-navbar-dark text-sm md:text-base lg:text-lg xl:text-xl rounded-sm"
          />
          <button
            type="submit"
            className="text-navbar-dark bg-white py-4 px-6 font-bold text-base md:text-lg lg:text-xl xl:text-2xl rounded-md hover:bg-slate-200 transition duration-150 ease-in"
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