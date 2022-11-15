function Footer() {
  return (
    <footer className="container mx-auto p-8 flex flex-col items-center justify-center gap-1 bg-slate-200 dark:bg-slate-800">
      <img
        src="./img/snowhill_logo.jpg"
        alt="Company Logo"
        className="h-14 rounded"
      />
      <strong className="font-semibold">Copyright &copy; 2022 SNOWHILL</strong>
      <p>All rights reserved</p>
    </footer>
  );
}

export default Footer;
