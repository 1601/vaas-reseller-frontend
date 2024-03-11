import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Hidden from '@mui/material/Hidden';
import Modal from '../utils/Modal';
import Calling from '../images/calling.png';
import Phone from '../images/phone.png';

function HeroHome() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const startStore = () => {
    navigate('/signup', { state: { email }, replace: true });
  };

  return (
    <section className="relative">
      {/* Illustration behind hero content */}
      {/*
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none" aria-hidden="true">
        <svg width="1360" height="578" viewBox="0 0 1360 578" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-01">
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </div>
      */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Hidden mdDown>
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            {/* Section header */}
            <div className="text-center pb-12 md:pb-16">
              <h1
                className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
                data-aos="zoom-y-out"
              >
                The Philippines <br /> <span style={{ color: '#A83CE2' }}>e-fullfillment platform</span>
              </h1>
              <div className="max-w-3xl mx-auto">
                <p className="text-sm text-gray-600 mb-8" data-aos="zoom-y-out" data-aos-delay="150">
                  The Fastest and Most Convenient Way to Send Prepaid Mobile Load Anytime, Anywhere.
                </p>
                <div
                  className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay="300"
                >
                  <div className="relative flex flex-col lg:flex-row items-center justify-center mt-7">
                    <form className="w-full lg:w-auto text-center">
                      <div className="flex flex-col sm:flex-row justify-center max-w-xs mx-auto sm:max-w-md lg:mx-0">
                        <div className="flex justify-center">
                          <TextField
                            type="email"
                            fullWidth
                            variant="outlined"
                            placeholder="Your email..."
                            value={email}
                            onChange={handleEmailChange}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              style: {
                                backgroundColor: '#0E121D',
                                color: 'white',
                                borderColor: '#0E121D',
                                borderRadius: '12px',
                                height: '2.5rem',
                                width: '248.18px',
                                marginRight: '10px',
                              },
                            }}
                          />

                          <Button
                            variant="contained"
                            color="primary"
                            onClick={startStore}
                            style={{
                              fontFamily: 'Shopify Sans, sans-serif',
                              overflow: 'hidden',
                              width: '189.64px',
                              height: '2.5rem',
                              transition: 'all',
                              backgroundColor: '#7F09E4',
                              border: '2px solid',
                              borderRadius: '12px',
                              borderColor: '#7F09E4',
                              outline: 'none',
                              textAlign: 'center',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap',
                              marginLeft: '-70px',
                              paddingLeft: '15px',
                            }}
                          >
                            Create my Own Shop
                          </Button>
                        </div>
                      </div>
                      <p style={{ fontSize: '.6rem', marginTop: '5px', textAlign: 'center' }}>
                        Experience Vortex, no credit card required. By entering your email, you agree to receive
                        marketing emails from Vortex.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="relative flex justify-center mb-8" data-aos="zoom-y-out" data-aos-delay="450">
                <div className="flex flex-row justify-center gap-5">
                  <img className="mx-auto" src={Calling} width="320" height="302" alt="Hero" />
                  <img className="mx-auto" src={Phone} width="320" height="302" alt="Hero" />

                  <defs>
                    <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="hero-ill-a">
                      <stop stopColor="#FFF" offset="0%" />
                      <stop stopColor="#EAEAEA" offset="77.402%" />
                      <stop stopColor="#DFDFDF" offset="100%" />
                    </linearGradient>
                    <linearGradient x1="50%" y1="0%" x2="50%" y2="99.24%" id="hero-ill-b">
                      <stop stopColor="#FFF" offset="0%" />
                      <stop stopColor="#EAEAEA" offset="48.57%" />
                      <stop stopColor="#DFDFDF" stopOpacity="0" offset="100%" />
                    </linearGradient>
                    <radialGradient cx="21.152%" cy="86.063%" fx="21.152%" fy="86.063%" r="79.941%" id="hero-ill-e">
                      <stop stopColor="#4FD1C5" offset="0%" />
                      <stop stopColor="#81E6D9" offset="25.871%" />
                      <stop stopColor="#338CF5" offset="100%" />
                    </radialGradient>
                    <circle id="hero-ill-d" cx="384" cy="216" r="64" />
                  </defs>
                  <g fill="none" fillRule="evenodd">
                    <circle fillOpacity=".04" fill="url(#hero-ill-a)" cx="384" cy="216" r="128" />
                    <circle fillOpacity=".16" fill="url(#hero-ill-b)" cx="384" cy="216" r="96" />
                    <g fillRule="nonzero">
                      <use fill="#000" xlinkHref="#hero-ill-d" />
                      <use fill="url(#hero-ill-e)" xlinkHref="#hero-ill-d" />
                    </g>
                  </g>
                </div>
                <button
                  className="absolute top-full flex items-center transform -translate-y-1/2 bg-white rounded-full font-medium group p-4 shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setVideoModalOpen(true);
                  }}
                  aria-controls="modal"
                >
                  <svg
                    className="w-6 h-6 fill-current text-gray-400 group-hover:text-purple-600 flex-shrink-0"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0 2C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12z" />
                    <path d="M10 17l6-5-6-5z" />
                  </svg>
                  <span className="ml-3">Watch to Learn More</span>
                </button>
              </div>

              {/* Modal */}
              <Modal
                id="modal"
                ariaLabel="modal-headline"
                show={videoModalOpen}
                handleClose={() => setVideoModalOpen(false)}
              >
                <div className="relative pb-9/16">
                  {/* eslint-disable-next-line */}
                  <iframe
                    className="absolute w-full h-full"
                    src="https://player.vimeo.com/video/174002812"
                    title="Video"
                    allowFullScreen
                  ></iframe>
                </div>
              </Modal>
            </div>

            {/* Hero image */}
            {/* <div>
                <div className="relative flex justify-center mb-8" data-aos="zoom-y-out" data-aos-delay="450">
                  <div className="flex flex-row justify-center gap-5">
                    <img className="mx-auto" src={Calling} width="162" height="151" alt="Hero" />
                    <img className="mx-auto" src={Phone} width="162" height="151" alt="Hero" />
                </div>

                {/* Modal 
                <Modal id="modal" ariaLabel="modal-headline" show={videoModalOpen} handleClose={() => setVideoModalOpen(false)}>
                  <div className="relative pb-9/16">
                    {/* eslint-disable-next-line 
                    <iframe className="absolute w-full h-full" src="https://player.vimeo.com/video/174002812" title="Video" allowFullScreen></iframe>
                  </div>
                </Modal>

              </div> */}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Typography variant="h5">Our solutions</Typography>
            <Typography variant="caption"> </Typography>
          </div>
        </Hidden>

        {/* Hero content Mobile Screen */}
        <Hidden mdUp>
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            {/* Section header */}
            <div className="text-left pb-12 md:pb-16">
              <h1
                className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
                data-aos="zoom-y-out"
              >
                The Philippines <br /> <span style={{ color: '#A83CE2' }}>e-fullfillment platform</span>
              </h1>
              <div className="max-w-3xl mx-auto">
                <p className="text-sm text-gray-600 mb-8" data-aos="zoom-y-out" data-aos-delay="150">
                  The Fastest and Most Convenient Way to Send Prepaid Mobile Load Anytime, Anywhere.
                </p>
                <div
                  className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay="300"
                >
                  <div className="relative flex flex-col lg:flex-row justify-between items-center">
                    {/* CTA form */}
                    {/* <form className="w-full lg:w-auto">
                      <div className="flex flex-col sm:flex-row justify-center max-w-xs mx-auto sm:max-w-md lg:mx-0">
                        <input type="email" className="form-input w-full appearance-none bg-gray-800 border border-gray-700 focus:border-gray-600 rounded-sm px-4 py-3 mb-2 sm:mb-0 sm:mr-2 text-white placeholder-gray-500" placeholder="Your email…" aria-label="Your email…" />
                        <Link to="/login" className="btn text-white bg-gradient-to-r from-blue-500 to-red-500 text-shopifysans font-bold inline-block leading-none overflow-hidden max-w-full transition-all focus-visible:outline-4 focus-visible:outline-focus focus-visible:outline-offset-[-2px] border-solid border-2 rounded-[30px] focus-visible:outline-none tracking-ff-tight border-[transparent] text-white bg-shade-100 hover:bg-shade-70 active:bg-shade-50 disabled:bg-shade-20 disabled:text-shade-30 text-body-sm px-[1.375rem] py-[0.875rem]">Apply as Retailer</Link>
                        {/* <a className="btn text-white bg-blue-600 hover:bg-blue-700 shadow" href="#0">Apply as Retailer</a> 
                      </div>
                      {/* Success message */}
                    {/* <p className="text-sm text-gray-400 mt-3">Thanks for subscribing!</p> *
                      <p className="text-sm text-gray-400 mt-3">Experience Vortex, no credit card required. By entering your email, you agree to receive marketing emails from Vortex.</p>
                  </form> */}
                    <form className="w-full lg:w-auto">
                      <div className="flex items-center justify-center max-w-xs mx-auto sm:max-w-md lg:mx-0">
                        <TextField
                          type="email"
                          fullWidth
                          variant="outlined"
                          placeholder="Your email…"
                          value={email}
                          onChange={handleEmailChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            style: {
                              backgroundColor: '#0E121D',
                              color: 'white',
                              borderColor: '#0E121D',
                              borderRadius: '12px',
                              height: '2.5rem',
                              width: '248.18px',
                            },
                          }}
                        />

                        <Button
                          onClick={startStore}
                          variant="contained"
                          color="primary"
                          style={{
                            fontFamily: 'Shopify Sans, sans-serif',
                            overflow: 'hidden',
                            width: '239.64px',
                            height: '2.5rem',
                            transition: 'all',
                            backgroundColor: '#7F09E4',
                            border: '2px solid',
                            borderRadius: '12px',
                            borderColor: '#7F09E4',
                            outline: 'none',
                            textAlign: 'center',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            marginLeft: '-4px',
                            paddingLeft: '15px',
                          }}
                        >
                          Create my Own Shop
                        </Button>
                      </div>
                      <p style={{ fontSize: '.5rem', marginTop: '5px', textAlign: 'center' }}>
                        Experience Vortex, no credit card required. By entering your email, you agree to receive
                        marketing emails from Vortex.
                      </p>
                    </form>
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                      <Typography variant="h5">Our solutions</Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div>
              <div className="relative flex justify-center mb-8" data-aos="zoom-y-out" data-aos-delay="450">
                <div className="flex flex-row justify-center gap-5">
                  <img className="mx-auto" src={Calling} width="162" height="151" alt="Hero" />
                  <img className="mx-auto" src={Phone} width="162" height="151" alt="Hero" />

                  {/* <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="hero-ill-a">
          <stop stopColor="#FFF" offset="0%" />
          <stop stopColor="#EAEAEA" offset="77.402%" />
          <stop stopColor="#DFDFDF" offset="100%" />
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="99.24%" id="hero-ill-b">
          <stop stopColor="#FFF" offset="0%" />
          <stop stopColor="#EAEAEA" offset="48.57%" />
          <stop stopColor="#DFDFDF" stopOpacity="0" offset="100%" />
        </linearGradient>
        <radialGradient cx="21.152%" cy="86.063%" fx="21.152%" fy="86.063%" r="79.941%" id="hero-ill-e">
          <stop stopColor="#4FD1C5" offset="0%" />
          <stop stopColor="#81E6D9" offset="25.871%" />
          <stop stopColor="#338CF5" offset="100%" />
        </radialGradient>
        <circle id="hero-ill-d" cx="384" cy="216" r="64" />
      </defs> */}
                  {/* <g fill="none" fillRule="evenodd">
        <circle fillOpacity=".04" fill="url(#hero-ill-a)" cx="384" cy="216" r="128" />
        <circle fillOpacity=".16" fill="url(#hero-ill-b)" cx="384" cy="216" r="96" />
        <g fillRule="nonzero">
          <use fill="#000" xlinkHref="#hero-ill-d" />
          <use fill="url(#hero-ill-e)" xlinkHref="#hero-ill-d" />
        </g>
      </g> */}
                </div>
                {/* <button className="absolute top-full flex items-center transform -translate-y-1/2 bg-white rounded-full font-medium group p-4 shadow-lg" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVideoModalOpen(true); }} aria-controls="modal">
      <svg className="w-6 h-6 fill-current text-gray-400 group-hover:text-purple-600 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0 2C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12z" />
        <path d="M10 17l6-5-6-5z" />
      </svg>
      <span className="ml-3">Watch the full video (2 min)</span>
    </button> */}
              </div>

              {/* Modal */}
              <Modal
                id="modal"
                ariaLabel="modal-headline"
                show={videoModalOpen}
                handleClose={() => setVideoModalOpen(false)}
              >
                <div className="relative pb-9/16">
                  {/* eslint-disable-next-line */}
                  <iframe
                    className="absolute w-full h-full"
                    src="https://player.vimeo.com/video/174002812"
                    title="Video"
                    allowFullScreen
                  ></iframe>
                </div>
              </Modal>
            </div>
          </div>
        </Hidden>
      </div>
    </section>
  );
}

export default HeroHome;
