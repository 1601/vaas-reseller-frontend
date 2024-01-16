import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';

// import FeaturesBg from '../images/features-bg.png';
import GiftImg from '../images/gifting-feature.jpg';
import BillsImg from '../images/billspayment-feature.jpg';
import ReachImg from '../images/reach-feature.jpg';

// import FeaturesElement from '../images/features-element.png';

function Features() {
  const imageStyle = {
    width: '100%', // full width of the container
    height: '0', // initial height, will be overridden by paddingBottom
    paddingBottom: '56.25%', // aspect ratio padding hack (16:9 aspect ratio)
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  };

  /*
  const [tab, setTab] = useState(1);

  const tabs = useRef(null);

   
  const heightFix = () => {
    if (tabs.current.children[tab]) {
      // eslint-disable-next-line
      tabs.current.style.height = tabs.current.children[tab - 1].offsetHeight + 'px';
    }
  };
  */

  /* 
  useEffect(() => {
    heightFix();
    // eslint-disable-next-line
  }, [tab]);
  */

  return (
    <section className="relative">
      {/* Section background (needs .relative class on parent and next sibling elements) */}
      {/* eslint-disable-next-line */}
      {/* <div className="absolute inset-0 bg-gray-100 pointer-events-none mb-16" aria-hidden="true"></div> */}
      {/* eslint-disable-next-line */}
      {/* <div className="absolute left-0 right-0 m-auto w-px p-px h-20 bg-gray-200 transform -translate-y-1/2"></div> */}

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20">
          {/* Section header */}
          {/* <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h2 mb-4">Explore the solutions</h1>
            <p className="text-xl text-gray-600">Looking for an easy and fast way to send prepaid mobile load to your friends and loved ones in the Philippines? Look no further! </p>
          </div> */}

          {/* Section content */}
          <div className="md:grid md:grid-cols-3 md:gap-6">
            {/* Tab item 1 */}
            <div className="flex flex-col items-center mb-6">
              <div
                style={{ ...imageStyle, backgroundImage: `url(${ReachImg})` }}
                className="mb-4 bg-cover bg-center w-full"
              />
              <h3 className="text-xl font-bold mb-2">Further your reach</h3>
              <p className="text-gray-600 text-center">
                Cater to Smart, SUN, and TNT subscribers worldwide and top billers in the Philippines.
              </p>
            </div>

            {/* Tab item 2 */}
            <div className="flex flex-col items-center mb-6">
              <div
                style={{ ...imageStyle, backgroundImage: `url(${BillsImg})` }}
                className="mb-4 bg-cover bg-center w-full"
              />
              <h3 className="text-xl font-bold mb-2 text-center">All your essential bills in one place</h3>
              <p className="text-gray-600 text-center">
                We offer fast and convenient way to pay your essential bills anytime, anywhere.
              </p>
            </div>

            {/* Tab item 3 */}
            <div className="flex flex-col items-center mb-6">
              <div
                style={{ ...imageStyle, backgroundImage: `url(${GiftImg})` }}
                className="mb-4 bg-cover bg-center w-full"
              />
              <h3 className="text-xl font-bold mb-2">Gifting made easy</h3>
              <p className="text-gray-600 text-center">
                Enable a hassle-free way for your customers to easily make someone feel special.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
