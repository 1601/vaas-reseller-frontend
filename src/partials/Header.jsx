import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VortexBlackLogo from '../assets/vortex_logo_black.png';

function Header() {

  const [top, setTop] = useState(true);

  // detect whether user has scrolled the page down by 10px 
  useEffect(() => {
    const scrollHandler = () => {
      // eslint-disable-next-line
      window.pageYOffset > 10 ? setTop(false) : setTop(true)
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [top]);

  return (
    <header className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${!top && 'bg-white backdrop-blur-sm shadow-lg'}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Site branding */}
          <div className="flex-shrink-0 mr-2 md:mr-4">
            {/* Logo */}
            <Link to="/" className="block" aria-label="Cruip">
              <img
                src={VortexBlackLogo}
                height="auto"  // Adjusted height to "auto" for responsiveness
                alt="Logo"
                style={{ maxWidth: "100%", maxHeight: "3rem" }}  // Adjusted max width and max height for responsiveness
              />
            </Link>
          </div>

          {/* Site navigation */}
          <nav>
            <ul className="flex items-center space-x-2 md:space-x-4">
              <li>
                <Link to="/signin" className="font-medium text-sm md:text-base text-gray-600 hover:text-gray-900 px-2 py-1 md:px-3 md:py-2 flex items-center transition duration-150 ease-in-out">Log in</Link>
              </li>
              <li>
                <Link to="/onboarding" className="btn text-white bg-gray-900 text-shopifysans font-bold inline-block leading-none overflow-hidden max-w-full transition-all focus-visible:outline-4 focus-visible:outline-focus focus-visible:outline-offset-[-2px] border-solid border-2 rounded-[20px] focus-visible:outline-none tracking-ff-tight border-[transparent] text-white bg-shade-100 hover:bg-shade-70 active:bg-shade-50 disabled:bg-shade-20 disabled:text-shade-30 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">Create Shop</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

  );
}

export default Header;
