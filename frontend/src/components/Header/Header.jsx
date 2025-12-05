import { NavLink, Link } from "react-router-dom";
import { useRef } from "react";
import { BiMenu, BiX } from "react-icons/bi";

const navLinks = [
  { path: "/home", display: "Home" },
  { path: "/doctors", display: "Find a Doctor" },
  { path: "/service", display: "Services" },
  { path: "/contact", display: "Contact" },
];

const Header = () => {
  const menuRef = useRef(null);

  const toggleMenu = () => {
    menuRef.current.classList.toggle("right-0");
    menuRef.current.classList.toggle("right-[-100%]");
  };

  return (
    <>
      {/* FIXED NAVBAR */}
      <header className="w-full h-[80px] fixed top-0 left-0 z-50 bg-white shadow-md flex items-center">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <div className="font-bold text-xl">logo</div>

            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center gap-10">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      isActive
                        ? "text-black font-bold"
                        : "text-black hover:text-red-500"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Login + Menu Icon */}
            <div className="flex items-center gap-4">
              <Link to="/login">
                <button className="bg-blue-500 px-6 py-2 font-semibold rounded-full text-white cursor-pointer">
                  Login
                </button>
              </Link>

              {/* Mobile Toggle Button */}
              <span className="block md:hidden" onClick={toggleMenu}>
                <BiMenu className="w-7 h-7 cursor-pointer" />
              </span>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          ref={menuRef}
          className="
            fixed top-0 right-[-100%]
            w-[70%] h-full bg-white shadow-lg
            p-8 pt-20 flex flex-col gap-6
            transition-all duration-300 md:hidden
          "
        >
          {/* Close */}
          <button
            className="absolute top-6 right-6 text-black"
            onClick={toggleMenu}
          >
            <BiX className="w-8 h-8" />
          </button>

          {/* Links */}
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              onClick={toggleMenu}
              className="text-black text-lg font-medium hover:text-red-500"
            >
              {link.display}
            </NavLink>
          ))}
        </div>
      </header>

      {/* FIX FOR OVERLAP → ADD SPACE BELOW NAVBAR */}
      <div className="h-[80px]"></div>
    </>
  );
};

export default Header;
