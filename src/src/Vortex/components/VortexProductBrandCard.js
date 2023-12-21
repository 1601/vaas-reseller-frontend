import React, { useState, useEffect } from 'react';
import { ButtonBase, Card } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const VortexProductBrandCard = ({ title = '', image, onClick = () => {} }) => {
  const [imgUrl, setImgUrl] = useState(image);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (title === 'ROW') {
        setImgUrl('https://upload.wikimedia.org/wikipedia/commons/0/0b/Blue_globe_icon.svg');
      } else {
        setImgUrl(`https://sparkle-vortex.imgix.net/${title}.png?w=120&h=120`);
      }
    }

    return () => {
      mounted = false;
    };
  }, [title]);

  return (
    <div>
      <Card
        sx={{
          margin: '0.5em',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          borderRadius: '16px', // Increased border radius for a more rounded look
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden', // Ensures the content does not flow outside the border radius
        }}
      >
        <ButtonBase
          onClick={onClick}
          style={{
            display: 'block',
            width: '90px',
            height: '90px',
          }}
        >
          <LazyLoadImage
            src={imgUrl}
            alt={title || 'Vortex Brand Image'}
            effect="blur"
            style={{
              objectFit: 'contain',
              width: '100%',
              height: '100%',
              borderRadius: '16px', // Ensure the image itself also has rounded corners
            }}
            onError={() => {
              setImgUrl('https://upload.wikimedia.org/wikipedia/commons/0/0b/Blue_globe_icon.svg');
            }}
          />
        </ButtonBase>
      </Card>
    </div>
  );
};

export default VortexProductBrandCard;
