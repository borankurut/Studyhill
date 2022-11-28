import { NavLink } from "react-router-dom";

function AvatarPage() {
  return (
    <div className="container mx-auto h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="font-semibold font-sans text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center p-6">
        Avatar Page
      </h1>
      <h2 className="text-sm md:text-base lg:text-lg xl:text-xl font-normal font-sans">
        This page will be available as soon as possible
      </h2>
      <NavLink
        to="/"
        className="underline text-xs md:text-sm lg:text-base xl:text-lg font-semibold"
      >
        Go To Home Page
      </NavLink>
    </div>
  );
}

export default AvatarPage;
