import React from 'react';

import {
  Typography,
  Grid,
  Paper,
} from '@mui/material';

const Image1 = (
  <svg className="w-16 h-16 p-1 -mt-1 mb-2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" fillRule="evenodd">
    <rect className="fill-current text-purple-600" width="64" height="64" rx="32" />
    <g strokeWidth="2">
      <path className="stroke-current text-purple-300" d="M34.514 35.429l2.057 2.285h8M20.571 26.286h5.715l2.057 2.285" />
      <path className="stroke-current text-white" d="M20.571 37.714h5.715L36.57 26.286h8" />
      <path className="stroke-current text-purple-300" strokeLinecap="square" d="M41.143 34.286l3.428 3.428-3.428 3.429" />
      <path className="stroke-current text-white" strokeLinecap="square" d="M41.143 29.714l3.428-3.428-3.428-3.429" />
    </g>
  </g>
</svg>
);

const Image2 = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect className="fill-current text-purple-600" width="64" height="64" rx="32" />
    <circle className="stroke-current text-white" strokeLinecap="square" cx="12.571" cy="12.571" r="1.143" />
    <path className="stroke-current text-white" d="M19.153 23.267c3.59-2.213 5.99-6.169 5.99-10.696C25.143 5.63 19.514 0 12.57 0 5.63 0 0 5.629 0 12.571c0 4.527 2.4 8.483 5.99 10.696" />
    <path className="stroke-current text-purple-300" d="M16.161 18.406a6.848 6.848 0 003.268-5.835 6.857 6.857 0 00-6.858-6.857 6.857 6.857 0 00-6.857 6.857 6.848 6.848 0 003.268 5.835" />
  </svg>
);

const Image3 = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect className="fill-current text-purple-600" width="64" height="64" rx="32" />
    <path className="stroke-current text-purple-300" d="M38.826 22.504a9.128 9.128 0 00-13.291-.398" />
    <path className="stroke-current text-purple-300" d="M35.403 25.546a4.543 4.543 0 00-6.635-.207" />
    <path className="stroke-current text-white" d="M19.429 25.143A6.857 6.857 0 0126.286 32v1.189L28 37.143l-1.714.571V40A2.286 2.286 0 0124 42.286h-2.286v2.285" />
    <path className="stroke-current text-white" d="M44.571 25.143A6.857 6.857 0 0037.714 32v1.189L36 37.143l1.714.571V40A2.286 2.286 0 0040 42.286h2.286v2.285" />
  </svg>
);

const Image4 = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect className="fill-current text-purple-600" width="64" height="64" rx="32" />
    <path className="stroke-current text-white" strokeLinecap="square" d="M12.571 4.571V0H0v25.143h12.571V20.57" />
    <path className="stroke-current text-white" d="M16 12.571h8" />
    <path className="stroke-current text-white" strokeLinecap="square" d="M19.429 8L24 12.571l-4.571 4.572" />
    <circle className="stroke-current text-purple-300" strokeLinecap="square" cx="12.571" cy="12.571" r="3.429" />
  </svg>
);

const Image5 = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect className="fill-current text-purple-600" width="64" height="64" rx="32" />
    <path className="stroke-current text-white" d="M20.571 20.571h13.714v17.143H20.571z" />
    <path className="stroke-current text-purple-300" d="M38.858 26.993l6.397 1.73-4.473 16.549-13.24-3.58" />
  </svg>
);

const Image6 = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect className="fill-current text-purple-600" width="64" height="64" rx="32" />
    <path className="stroke-current text-white" d="M32 37.714A5.714 5.714 0 0037.714 32a5.714 5.714 0 005.715 5.714" />
    <path className="stroke-current text-white" d="M32 37.714a5.714 5.714 0 015.714 5.715 5.714 5.714 0 015.715-5.715M20.571 26.286a5.714 5.714 0 005.715-5.715A5.714 5.714 0 0032 26.286" />
    <path className="stroke-current text-white" d="M20.571 26.286A5.714 5.714 0 0126.286 32 5.714 5.714 0 0132 26.286" />
    <path className="stroke-current text-purple-300" d="M21.714 40h4.572M24 37.714v4.572M37.714 24h4.572M40 21.714v4.572" strokeLinecap="square" />
  </svg>
);


function FeaturesBlocks() {
  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <Typography variant="h4" component="h2" gutterBottom>
              With Vortex
            </Typography>
            <Typography variant="body1" color="textSecondary">
              You can enjoy, whether you're abroad or just busy with work, our platform makes it easy to stay connected with your friends and family back home.
            </Typography>
          </div>
          <Grid container spacing={3} justifyContent="center">
            {[
              { image: Image1, title: 'Top ups', description: 'Fast and convenient top ups anytime, anywhere.' },
              { image: Image2, title: 'Multi-network', description: 'Support for Smart, Sun, and TNT prepaid mobile numbers.' },
              { image: Image3, title: 'Bills Payment', description: 'Payment to top billers in the Philippines.' },
              { image: Image4, title: 'Earn', description: 'Load up, get discounts, and earn in a click.' },
              { image: Image5, title: 'Security', description: 'Secure and reliable payment methods.' },
              { image: Image6, title: 'Ease of use', description: 'Easy-to-use platform accessible from anywhere.' },
            ].map((item, index) => (
              <Grid item key={index} xs={12} md={4}>
                <Paper elevation={3} className="p-4 text-center">
                  {/* <img src={item.image} alt={item.title} className="w-16 h-16 mb-2" /> */}
                  {item.image}
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </section>
  );
}

export default FeaturesBlocks;
