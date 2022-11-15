import Navbar from "./Components/Navbar.js";
import Home from "./Components/Home.js";
import Footer from "./Components/Footer.js";

function App() {
  document.body.classList.add(
    "h-screen",
    "dark:text-white",
    "dark:bg-slate-700",
    "bg-slate-100"
  );

  // Add some styling to body tag
  return (
    <>
      <Navbar />
      <Home />
      <Footer />
    </>
  );
}

export default App;
