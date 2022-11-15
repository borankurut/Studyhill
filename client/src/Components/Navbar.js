function Navbar() {
  return (
    <nav className="container mx-auto bg-blue-100 dark:bg-blue-900 dark:text-white p-6 flex justify-between items-center">
      <a href="/" className="text-xl md:text-3xl font-semibold tracking-wider">
        STUDYHILL
      </a>

      <div className="text-white flex items-center justify-around gap-4 md:gap-6">
        <a
          href="/"
          className="text-sm md:text-base py-2 px-3 md:py-4 md:px-6 bg-red-800 hover:bg-red-700 rounded-full ease-in duration-100"
        >
          SING UP
        </a>
        <a
          href="/"
          className="text-sm md:text-base py-2 px-3 md:py-4 md:px-6 bg-red-800 hover:bg-red-700 rounded-full ease-in duration-100"
        >
          LOG IN
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
