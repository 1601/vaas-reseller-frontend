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
          <div className="flex-shrink-0 mr-4">
            {/* Logo */}
            <Link to="/" className="block" aria-label="Cruip">
            
            <img src={VortexBlackLogo}  height="50" alt="Logo" style={{height:"5em"}}/> 
            {/* width="768" */}
            </Link>
          </div>

          {/* Site navigation */}
          <nav className="flex flex-grow">
            <ul className="flex flex-grow justify-end flex-wrap items-center">
              <li>
                <Link to="/login" className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out">Log in</Link>
              </li>
              <li>
                <Link to="/onboarding" className="btn text-white bg-gray-900 text-shopifysans font-bold inline-block leading-none overflow-hidden max-w-full transition-all focus-visible:outline-4 focus-visible:outline-focus focus-visible:outline-offset-[-2px] border-solid border-2 rounded-[30px] focus-visible:outline-none tracking-ff-tight border-[transparent] text-white bg-shade-100 hover:bg-shade-70 active:bg-shade-50 disabled:bg-shade-20 disabled:text-shade-30 text-body-sm px-[1.375rem] py-[0.875rem]">Apply as Retailer</Link>
              </li>
              {/* <li>
                <Link to="/signup" className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3">
                  <span>Sign up</span>
                  <svg className="w-3 h-3 fill-current text-gray-400 flex-shrink-0 ml-2 -mr-1" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z" fillRule="nonzero" />
                  </svg>                  
                </Link>
              </li> */}
            </ul>

          </nav>

        </div>
      </div>
    </header>
  );
}

export default Header;
