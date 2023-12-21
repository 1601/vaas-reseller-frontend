import React, { useState } from 'react';
import { Card, CardMedia } from '@mui/material';

const fallbackImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Blue_globe_icon.svg';

const TopUpImage = ({ title }) => {
  const [imgSrc, setImgSrc] = useState(`https://sparkle-vortex.imgix.net/${title}.png?w=120&h=120`);

  const handleError = () => {
    setImgSrc(fallbackImageUrl);
  };

  return (
    <Card sx={{
      width: 120, 
      height: 120, 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden', 
      margin: 'auto'
    }}>
      <CardMedia
        component="img"
        image={imgSrc}
        alt={`${title} logo`}
        onError={handleError}
        sx={{
          maxWidth: '100%', 
          maxHeight: '100%', 
          objectFit: 'contain', 
        }}
      />
    </Card>
  );
};

export default TopUpImage;